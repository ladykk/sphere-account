import db from "@/db";
import { files } from "@/db/schema/file";
import { and, eq, gt, isNull } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";
import { checkAccessControl, deleteObject, getObject, uploadObject } from ".";
import { getBaseUrl } from "@/trpc/shared";

type FileProps = {
  params: {
    id: string;
  };
};

export const GET_FILE = async (req: NextRequest, props: FileProps) => {
  // Search Params
  const no_cache = z
    .enum(["true", "false"])
    .parse(req.nextUrl.searchParams.get("no_cache") ?? "false");

  // Get file from database
  const file = await db
    .select({ id: files.id, readAccessControl: files.readAccessControl })
    .from(files)
    .where(eq(files.id, props.params.id));

  // If file not found, return 404
  if (file.length === 0)
    return new Response(undefined, {
      status: 404,
    });

  // Check access control
  const isAuthorized = await checkAccessControl(file[0].readAccessControl);

  if (!isAuthorized)
    return new Response(undefined, {
      status: 401,
    });

  const object = await getObject(file[0].id);

  if (!object)
    return new Response(undefined, {
      status: 404,
    });

  return new Response(object, {
    headers:
      no_cache === "false" ? { "cache-control": "public, max-age=86400" } : {},
  });
};

export const PUT_FILE = async (req: NextRequest, props: FileProps) => {
  const blob = await req.blob();

  if (!blob)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Invalid file.",
      }),
      {
        status: 400,
      }
    );

  // Wait 1 second to prevent 404
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get file from database
  const file = await db
    .select({ id: files.id, writeAccessControl: files.writeAccessControl })
    .from(files)
    .where(
      and(
        eq(files.id, props.params.id),
        isNull(files.uploadedAt),
        gt(files.expiredAt, new Date())
      )
    );

  if (file.length === 0)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL not found.",
      }),
      {
        status: 404,
      }
    );

  const isAuthorized = await checkAccessControl(file[0].writeAccessControl);

  if (!isAuthorized)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Unauthorized.",
      }),
      {
        status: 401,
      }
    );

  const result = uploadObject(file[0].id, blob);

  if (!result)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Upload failed.",
      }),
      {
        status: 500,
      }
    );

  await db
    .update(files)
    .set({
      uploadedAt: new Date(),
    })
    .where(eq(files.id, file[0].id));

  return new Response(
    JSON.stringify({
      status: "success",
      url: `${getBaseUrl()}/api/file/${file[0].id}`,
    }),
    {
      status: 201,
    }
  );
};

export const DELETE_FILE = async (req: NextRequest, props: FileProps) => {
  const file = await db
    .select({ id: files.id, writeAccessControl: files.writeAccessControl })
    .from(files)
    .where(and(eq(files.id, props.params.id), gt(files.expiredAt, new Date())));

  // If file not found, return 404
  if (file.length === 0)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL not found.",
      }),
      {
        status: 404,
      }
    );

  // Check access control
  const isAuthorized = await checkAccessControl(file[0].writeAccessControl);

  // If not authorized, return 401
  if (!isAuthorized)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Unauthorized",
      }),
      {
        status: 401,
      }
    );

  // Delete file from R2
  await deleteObject(file[0].id);

  await db.delete(files).where(eq(files.id, file[0].id));

  return new Response(
    JSON.stringify({
      status: "success",
    }),
    {
      status: 200,
    }
  );
};
