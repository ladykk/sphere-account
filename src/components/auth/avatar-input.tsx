import { ReactNode, useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  FileUploadDropzone,
  SingleFileUploadDropzoneBaseProps,
} from "../ui/file-upload";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FileUploadState, useFileUploadState } from "@/lib/file";
type AvatarInputProps = {
  children: (fileUrl: string | null) => ReactNode;
} & Omit<SingleFileUploadDropzoneBaseProps, "multiple">;

export const AvatarInput = (props: AvatarInputProps) => {
  const { children, ...fileUploadProps } = props;
  const fileUrl = useMemo(() => {
    return props.value ? URL.createObjectURL(props.value) : null;
  }, [props.value]);

  return (
    <Dialog open={props.disabled ? false : undefined}>
      <DialogTrigger asChild>{children(fileUrl)}</DialogTrigger>
      <DialogContent className=" max-w-xl" hideClose>
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Accept File Types: .png, .jpg, .jpeg, .webp
          </DialogDescription>
        </DialogHeader>
        {props.value ? (
          <Avatar className="w-48 h-48 rounded-md border shadow border-input cursor-pointer hover:opacity-70 transition-opacity mx-auto">
            <AvatarImage src={fileUrl ?? ""} />
          </Avatar>
        ) : (
          <FileUploadDropzone
            {...fileUploadProps}
            multiple={false}
            accept={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "image/webp": [".webp"],
            }}
          />
        )}
        <DialogFooter>
          {props.value ? (
            <>
              <DialogClose asChild>
                <Button variant="secondary" type="button">
                  Confirm
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => props.onChange(null)}
                  type="button"
                >
                  Clear
                </Button>
              </DialogClose>
            </>
          ) : (
            <DialogClose asChild>
              <Button variant="destructive" type="button">
                Cancel
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
