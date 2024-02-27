import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type FileInfo = {
  uri: string;
  fileName: string;
  fileType: string;
};

type FileViewerProps = {
  files?: File[];
  uris?: Array<FileInfo>;
  selectIndex?: number;
  onIndexChanged?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const FileViewer = (props: FileViewerProps) => {
  const [documents, setDocuments] = useState<Array<FileInfo>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Set documents when files change
  useEffect(() => {
    const files =
      props.files?.map((file) => {
        return {
          uri: URL.createObjectURL(file),
          fileName: file.name,
          fileType: file.type,
        };
      }) ?? [];
    const urls = props.uris ?? [];

    setDocuments([...files, ...urls]);

    setActiveIndex(0);

    return () => {
      for (const file of files) {
        URL.revokeObjectURL(file.uri);
      }
    };
  }, [props.files, props.uris]);

  // Set active document when selectIndex changes
  useEffect(() => {
    if (
      props.selectIndex !== undefined &&
      props.selectIndex < documents.length
    ) {
      setActiveIndex(props.selectIndex);
      props.onIndexChanged?.();
    }
  }, [props.selectIndex, documents]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className=" max-w-none w-screen h-screen max-h-screen sm:rounded-none border-0 flex flex-col">
        <div className="flex justify-between items-center h-fit">
          <DialogHeader>
            <DialogTitle>File Viewer</DialogTitle>
            <DialogDescription>
              {documents.length > 0
                ? documents[activeIndex].fileName
                : "No documents to display"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 items-center mr-7">
            <p>
              File {activeIndex + 1} of {documents.length}
            </p>
            <Button
              size="icon"
              variant="outline"
              type="button"
              onClick={() => {
                toast.info("Preparing file for download");
                const link = document.createElement("a");
                link.href = documents[activeIndex].uri;
                link.download = documents[activeIndex].fileName;
                link.click();
              }}
            >
              <Download />
            </Button>
            <Button
              size="icon"
              variant="outline"
              type="button"
              onClick={() => {
                const newIndex =
                  activeIndex === 0 ? documents.length - 1 : activeIndex - 1;
                setActiveIndex(newIndex);
              }}
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              variant="outline"
              type="button"
              onClick={() => {
                const newIndex =
                  activeIndex === documents.length - 1 ? 0 : activeIndex + 1;
                setActiveIndex(newIndex);
              }}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="bg-muted flex-1 border rounded-md">
          <p>TODO: Add Renderer in each file type</p>
          <p>
            {JSON.stringify(documents.length > 0 ? documents[activeIndex] : {})}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
