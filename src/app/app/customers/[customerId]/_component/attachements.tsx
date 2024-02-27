"use client";
import { AttachmentTable } from "@/components/customer/attachment-table";
import { TabsContent } from "@/components/ui/tabs";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormInput } from "../page";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";
import { MultipleDropzoneUpload } from "@/components/ui/file-upload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, MousePointerSquare, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CUSTOMER_ATTACHMENT_TYPE } from "@/static/customer";
import { useState } from "react";
import { FileViewer } from "@/components/ui/file-viewer";
import { toast } from "sonner";

type Props = {
  tabContentClassName: string;
  form: UseFormReturn<FormInput>;
  customerId: string;
  isCreate: boolean;
  isEdit: boolean;
};

export const AttachementsTab = ({
  tabContentClassName,
  form,
  customerId,
  isCreate,
  isEdit,
}: Props) => {
  const newAttachments = useFieldArray({
    control: form.control,
    name: "files.attachements",
  });
  const uploadedAttachments = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  const uploadedAttachmentIds = form
    .watch("attachments")
    .map((attachment) => attachment.id);

  const [open, setOpen] = useState(false);
  const [selectIndex, setSelectIndex] = useState<number | undefined>(undefined);
  const query = api.customer.getCustomer.useQuery(customerId, {
    enabled: !isCreate,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return (
    <TabsContent value="attachments" className={tabContentClassName}>
      <FileViewer
        files={newAttachments.fields.map((field) => field.file)}
        uris={uploadedAttachments.fields.map((field, index) => ({
          uri: field.fileUrl,
          fileName:
            query.data?.attachments.find(
              (attachment) => attachment.id === uploadedAttachmentIds[index]
            )?.fileName ?? "",
          fileType:
            query.data?.attachments.find(
              (attachment) => attachment.id === uploadedAttachmentIds[index]
            )?.fileType ?? "",
        }))}
        selectIndex={selectIndex}
        onIndexChanged={() => setSelectIndex(undefined)}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="space-y-3">
        {(isCreate || isEdit) && (
          <div className="space-y-5">
            <FormItem>
              <FormLabel>Upload Attachments</FormLabel>
              <FormControl>
                <MultipleDropzoneUpload
                  value={newAttachments.fields.map((field) => field.file)}
                  onChange={(newFileArray) => {
                    if (!newFileArray) {
                      newAttachments.remove();
                      return;
                    }
                    const newFiles = newFileArray.slice(
                      newAttachments.fields.length
                    );
                    newAttachments.append(
                      newFiles.map((file) => ({
                        fileCategory: "infomation",
                        file,
                      }))
                    );
                  }}
                  disabled={form.formState.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <div className="overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>
                      File Category <span className="">*</span>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isCreate && (
                    <TableRow>
                      <TableCell colSpan={4} className=" bg-primary/30">
                        Pending Uploaded
                      </TableCell>
                    </TableRow>
                  )}
                  {newAttachments.fields.length > 0 ? (
                    newAttachments.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{field.file.name}</TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`files.attachements.${index}.fileCategory`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    disabled={field.disabled}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select File Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(
                                        CUSTOMER_ATTACHMENT_TYPE
                                      ).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                          {value.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                            size="icon"
                            variant="outline"
                            type="button"
                            onClick={() => {
                              toast.info("Preparing file for download");
                              const url = URL.createObjectURL(field.file);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = field.file.name;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash2 />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Pending Upload Attachement
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure to remove file "{field.file.name}
                                  " from the pending upload attachements?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}
                                  onClick={() => {
                                    newAttachments.remove(index);
                                  }}
                                >
                                  Remove
                                </AlertDialogAction>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-20">
                        No files to upload
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {!isCreate && (
                  <TableRow>
                    <TableCell colSpan={4} className=" bg-primary/30">
                      Uploaded
                    </TableCell>
                  </TableRow>
                )}
                {!isCreate &&
                  (uploadedAttachments.fields.length > 0 ? (
                    uploadedAttachments.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>
                          {
                            query.data?.attachments.find(
                              (attachment) =>
                                attachment.id === uploadedAttachmentIds[index]
                            )?.fileName
                          }
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`attachments.${index}.fileCategory`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    disabled={field.disabled}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select File Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(
                                        CUSTOMER_ATTACHMENT_TYPE
                                      ).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                          {value.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="space-x-3">
                          <Button
                            size="icon"
                            variant="outline"
                            type="button"
                            onClick={() => {
                              setSelectIndex(
                                newAttachments.fields.length + index
                              );
                              setOpen(true);
                            }}
                          >
                            <MousePointerSquare />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            type="button"
                            onClick={() => {
                              const attachement = query.data?.attachments.find(
                                (attachment) =>
                                  attachment.id === uploadedAttachmentIds[index]
                              );
                              if (!attachement) return;
                              toast.info("Preparing file for download");
                              const url = attachement.fileUrl;
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = attachement.fileName;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash2 />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Pending Upload Attachement
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure to remove file "
                                  {
                                    query.data?.attachments.find(
                                      (attachment) =>
                                        attachment.id ===
                                        uploadedAttachmentIds[index]
                                    )?.fileName
                                  }
                                  " from the pending upload attachements?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}
                                  onClick={() => {
                                    uploadedAttachments.remove(index);
                                  }}
                                >
                                  Remove
                                </AlertDialogAction>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-20">
                        No Uploaded Attachements
                      </TableCell>
                    </TableRow>
                  ))}
              </Table>
            </div>
          </div>
        )}
        {!isCreate && !isEdit && (
          <AttachmentTable data={query.data?.attachments} />
        )}
      </div>
    </TabsContent>
  );
};
