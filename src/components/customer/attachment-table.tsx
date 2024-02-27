import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CUSTOMER_ATTACHMENT_TYPE } from "@/static/customer";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/shared";
import { AuthMetadata } from "../auth/auth-info";
import { Download, MousePointerSquare } from "lucide-react";
import { FileViewer } from "../ui/file-viewer";
import { toast } from "sonner";

const FILE_CATEGORY_FILTER = {
  all: {
    label: "All",
  },
  ...CUSTOMER_ATTACHMENT_TYPE,
} as const;

type Props = {
  data?: RouterOutputs["customer"]["getCustomer"]["attachments"];
  className?: string;
};

export function AttachmentTable(props: Props) {
  const [open, setOpen] = useState(false);
  const [selectIndex, setSelectIndex] = useState<number | undefined>(undefined);

  const [fileCategory, setFileCategory] =
    useState<keyof typeof FILE_CATEGORY_FILTER>("all");

  const filteredAttachments =
    props.data?.filter(
      (attachment) =>
        fileCategory === "all" || attachment.fileCategory === fileCategory
    ) ?? [];
  return (
    <div className={cn("space-y-3", props.className)}>
      <FileViewer
        uris={filteredAttachments?.map((attachment) => ({
          uri: attachment.fileUrl,
          fileName: attachment.fileName,
          fileType: attachment.fileType,
        }))}
        selectIndex={selectIndex}
        onIndexChanged={() => {
          setSelectIndex(selectIndex);
        }}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex items-center">
        {Object.entries(FILE_CATEGORY_FILTER).map(([key, value]) => (
          <Button
            value={key}
            variant="ghost"
            type="button"
            className={cn(
              "rounded-none border-b-2",
              fileCategory === key ? "border-b-primary" : "border-b-transparent"
            )}
            onClick={() =>
              setFileCategory(key as keyof typeof FILE_CATEGORY_FILTER)
            }
          >
            {value.label}
          </Button>
        ))}
      </div>
      <div className="rounded-md border overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>File name</TableHead>
              <TableHead>File Category</TableHead>
              <TableHead>Upload by</TableHead>
              <TableHead>Uploaded On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttachments?.length > 0 ? (
              filteredAttachments?.map((attachment, index) => (
                <TableRow key={attachment.id}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{attachment.fileName}</TableCell>
                  <TableCell>
                    {CUSTOMER_ATTACHMENT_TYPE[attachment.fileCategory].label}
                  </TableCell>
                  <TableCell>
                    <AuthMetadata userId={attachment.uploadedBy} />
                  </TableCell>
                  <TableCell>
                    {new Date(attachment.uploadedAt).toLocaleString("th-TH")}
                  </TableCell>
                  <TableCell className="space-x-3">
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setSelectIndex(index);
                        setOpen(true);
                      }}
                    >
                      <MousePointerSquare />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => {
                        toast.info("Preparing file for download");
                        const url = attachment.fileUrl;
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = attachment.fileName;
                        a.click();
                      }}
                    >
                      <Download />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-20">
                  No attachments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
