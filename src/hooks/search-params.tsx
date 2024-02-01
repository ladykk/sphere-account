"use client";
import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useCallback } from "react";

export function useSearchParams(mode: "push" | "replace" = "push") {
  const searchParams = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const get = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const set = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(key, value);
      if (mode === "push") {
        router.push(`${pathname}?${newParams.toString()}`);
      } else {
        router.replace(`${pathname}?${newParams.toString()}`);
      }
    },
    [searchParams]
  );

  const clear = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete(key);
      if (mode === "push") {
        router.push(`${pathname}?${newParams.toString()}`);
      } else {
        router.replace(`${pathname}?${newParams.toString()}`);
      }
    },
    [searchParams]
  );

  return { get, set, clear };
}
