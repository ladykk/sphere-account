import { type ClassValue, clsx } from "clsx";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { ZodIssue, typeToFlattenedError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleTRPCFormError<T extends FieldValues>(
  error: ZodIssue[] | null | undefined,
  setError: UseFormSetError<T>
) {
  if (!error) return;
  for (const issue of error) {
    setError(issue.path.join(".") as Path<T>, {
      type: "manual",
      message: issue.message,
    });
  }
}
