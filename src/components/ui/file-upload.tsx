import { DropzoneOptions, useDropzone } from "react-dropzone";
import { useCallback } from "react";

export type FileUploadDropzoneBaseProps = {
  onRejectFiles?: (files: File[]) => void;
  disabled?: boolean;
  accept?: DropzoneOptions["accept"];
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
        className:
          "w-full px-5 py-8 border border-dashed rounded-md cursor-pointer bg-muted flex flex-col items-center justify-center",
      })}
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground text-center">
        Drag 'n' drop some files here, or click to select files
      </p>
    </div>
  );
};
