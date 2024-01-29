import { env } from "@/env/server.mjs";
import { TAccessControl } from "./access-control";
import S3 from "aws-sdk/clients/s3";
import { getServerAuthSession } from "../auth/server";
import db from "@/db";
import { files } from "@/db/schema/file";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getBaseUrl } from "@/trpc/shared";
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const client = new S3({
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_ACCESS_SECRET_KEY,
  },
  signatureVersion: "v4",
  region: "auto",
});

export async function getObject(key: string): Promise<BodyInit | null> {
  try {
    const result = await client
      .getObject({
        Bucket: env.R2_BUCKET,
        Key: key,
      })
      .promise();
    return result.Body as BodyInit;
  } catch (err) {
    return null;
  }
}

export async function deleteObject(key: string): Promise<boolean> {
  try {
    await client
      .deleteObject({
        Bucket: env.R2_BUCKET,
        Key: key,
      })
      .promise();
    return true;
  } catch (err) {
    return false;
  }
}

export async function uploadObject(
  key: string,
  file: Blob
): Promise<string | null> {
  try {
    await client
      .putObject({
        Bucket: env.R2_BUCKET,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
      })
      .promise();
    return key;
  } catch (err) {
    console.error(`[R2]: Failed to upload object. ${err}`);
    return null;
  }
}

export const checkAccessControl = async (accessControl: TAccessControl) => {
  const unknownRule = String(accessControl.rule);
  switch (accessControl.rule) {
    case "public":
      return true;
    case "userId":
      const session = await getServerAuthSession();
      if (!session) return false;
      if (session.user.id === accessControl.userId) return true;
      return false;
    default:
      console.warn(`[R2]: Not implemented access control rule. ${unknownRule}`);
      return false;
  }
};

export const generatePresignedUrlInputSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export type TGeneratePresignedUrlInput = z.infer<
  typeof generatePresignedUrlInputSchema
>;

export const generatePresignedUrl = async (
  issuedBy: string,
  readAccessControl: TAccessControl,
  writeAccessControl: TAccessControl,
  options: TGeneratePresignedUrlInput
) => {
  const date = new Date();
  const extenstion = options.fileName.split(".").pop();
  const result = await db
    .insert(files)
    .values({
      id: `${crypto.randomUUID()}-${date.toISOString()}.${extenstion}`,
      fileName: options.fileName,
      fileType: options.fileType,
      fileSize: options.fileSize,
      issuedAt: date,
      expiredAt: new Date(date.getTime() + 86400000), // 24 hours
      issuedBy: issuedBy,
      readAccessControl: readAccessControl,
      writeAccessControl: writeAccessControl,
    })
    .returning({
      key: files.id,
    });
  return result[0].key;
};

export const getIdFromUrl = (url: string | undefined | null) => {
  if (!url) return null;
  const baseStorageUrl = `${getBaseUrl()}/files/`;

  // Skip if the url is not a storage url
  if (!url.startsWith(baseStorageUrl)) return null;

  const key = url.replace(baseStorageUrl, "");
  return key;
};

export const deleteFileById = async (id: string) => {
  // Get file from database
  const file = await db
    .select({
      id: files.id,
      writeAccessControl: files.writeAccessControl,
    })
    .from(files)
    .where(eq(files.id, id))
    .limit(1);

  if (file.length === 0) {
    console.info(`[R2]: File not found in DB. Skip delete. ${id}`);
    return;
  }

  // Check access control
  const isAuthorized = await checkAccessControl(file[0].writeAccessControl);

  // If not authorized, return 401
  if (!isAuthorized) return;

  // Delete file from R2
  const result = await deleteObject(file[0].id);

  // If file not found, return 404
  if (!result) {
    console.info(`[R2]: File not found in R2. ${id}`);
  }

  // Delete file from database
  await db.delete(files).where(eq(files.id, file[0].id)).execute();

  // Return success
  return;
};

export const deleteFileByUrl = async (url: string) => {
  const key = getIdFromUrl(url);

  if (!key) {
    console.info(`[R2]: Invalid url. Skip delete. ${url}`);
    return;
  }

  await deleteFileById(key);
};
