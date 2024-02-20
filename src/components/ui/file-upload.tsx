import { DropzoneOptions, useDropzone } from "react-dropzone";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";

export type FileUploadDropzoneBaseProps = {
  onRejectFiles?: (files: File[]) => void;
  disabled?: boolean;
  accept?: DropzoneOptions["accept"];
  className?: string;
};

export type SingleFileUploadDropzoneProps = FileUploadDropzoneBaseProps & {
  multiple: false;
  value: File | null;

  onChange: (file: File | null) => void;
};

export type MultipleFileUploadDropzoneProps = FileUploadDropzoneBaseProps & {
  multiple: true;
  value: File[];
  onChange: (files: File[] | null) => void;
};

export const FileUploadDropzone = (
  props: SingleFileUploadDropzoneProps | MultipleFileUploadDropzoneProps
) => {
  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    (acceptedFiles, fileRejections, event) => {
      // Call function to handle rejected files
      if (fileRejections.length > 0)
        props.onRejectFiles?.(
          fileRejections.map((rejection) => rejection.file)
        );

      // Call function to handle accepted files
      if (props.multiple) props.onChange([...props.value, ...acceptedFiles]);
      else
        props.onChange(
          acceptedFiles.length === 0 ? props.value : acceptedFiles[0]
        );
    },
    [props.value]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled: props.disabled,
    accept: props.accept,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "w-full px-5 py-8 border border-dashed rounded-md cursor-pointer bg-muted flex flex-col items-center justify-center",
          props.className
        ),
      })}
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground text-center">
        Drag 'n' drop some files here, or click to select files
      </p>
    </div>
  );
};

type DialogUploadProps = {
  children: (fileUrl: string | null) => ReactNode;
  header?: string;
} & Omit<SingleFileUploadDropzoneProps, "multiple">;

export const DialogUpload = (props: DialogUploadProps) => {
  const { children, ...fileUploadProps } = props;
  const fileUrl = useMemo(() => {
    return props.value ? URL.createObjectURL(props.value) : null;
  }, [props.value]);
  const [isOpen, setIsOpen] = useState(false);

  const acceptFileTypes = fileUploadProps.accept
    ? Object.values(fileUploadProps.accept).flatMap((exts) => exts)
    : [];

  const onChange = (file: File | null) => {
    fileUploadProps.onChange(file);
    setIsOpen(false);
  };

  return (
    <Dialog open={props.disabled ? false : isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children(fileUrl)}</DialogTrigger>
      <DialogContent className=" max-w-xl" hideClose>
        <DialogHeader>
          <DialogTitle>{props.header ?? "Upload File"}</DialogTitle>
          <DialogDescription>
            {acceptFileTypes.length > 0
              ? `Accept File Types: ${acceptFileTypes.join(", ")}`
              : "Accept All File Types"}
          </DialogDescription>
        </DialogHeader>

        <FileUploadDropzone
          {...fileUploadProps}
          onChange={onChange}
          multiple={false}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
