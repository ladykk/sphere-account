"use client";
import type { generatePresignedUrlInputSchema } from "@/server/modules/file";
import { z } from "zod";
import { create } from "zustand";
import axios from "axios";

type FileUploadState = {
  states: {
    [key: string]: {
      status: "idle" | "uploading" | "done" | "error";
      progress: number;
    };
  };
  setFileUploadState: (
    key: string,
    options:
      | {
          status: "idle" | "done" | "error";
        }
      | {
          status: "uploading";
          progress: number;
        }
  ) => void;
};

export const useFileUpload = create<FileUploadState>((set) => ({
  states: {},
  setFileUploadState(key, options) {
    return set((state) => ({
      states: {
        ...state.states,
        [key]: {
          status: options.status,
          progress: options.status === "uploading" ? options.progress : 0,
        },
      },
    }));
  },
}));

export const useFileUploadState = (key: string) => {
  const state = useFileUpload((state) => state.states[key]);
  return state;
};

export const fileToPresignedUrlInput = (
  file: File
): z.infer<typeof generatePresignedUrlInputSchema> => {
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
};

export const uploadFile = async (
  key: string,
  file: File,
  setFileUploadState?: FileUploadState["setFileUploadState"]
) => {
  setFileUploadState?.(key, {
    status: "idle",
  });
  return await axios({
    method: "PUT",
    url: `/api/file/${key}`,
    data: file,
    onUploadProgress(progressEvent) {
      if (setFileUploadState) {
        const loaded = progressEvent.loaded ?? 0;
        const total = progressEvent.total ?? 0;

        const progress = Math.round((loaded / total) * 100);
        setFileUploadState(key, {
          status: "uploading",
          progress: progress || 0,
        });
      }
    },
  })
    .then(() => {
      setFileUploadState?.(key, {
        status: "done",
      });
      return key;
    })
    .catch((error) => {
      setFileUploadState?.(key, {
        status: "error",
      });
      throw error;
    });
};

export const deleteFile = async (key: string) => {
  await axios({
    method: "DELETE",
    url: `/api/file/${key}`,
  });
  return;
};
