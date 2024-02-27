import { DefaultValues, UseFormReturn, useFieldArray } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Paperclip, Plus, Trash2 } from "lucide-react";
import { CustomerTab, FormInput, defaultContact } from "../_meta";

type Props = {
  tabContentClassName: string;
  form: UseFormReturn<FormInput>;
  isCreate: boolean;
  isEdit: boolean;
  setTab: (tab: CustomerTab) => void;
};

export const ContactPersonsTab = ({
  tabContentClassName,
  form,
  isEdit,
  isCreate,
  setTab,
}: Props) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const attachment = form.watch("attachments");
  const contactAttachments = attachment.filter(
    (attach) => attach.fileCategory === "contactPersons"
  );

  return (
    <TabsContent value="contacts" className={tabContentClassName}>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex justify-between items-center">
              <p className="text-orange-500 font-semibold">
                Contact Person {index + 1}
              </p>
              <FormField
                control={form.control}
                name={`contacts.${index}.isActive`}
                render={({ field }) => (
                  <FormItem className="ml-auto">
                    <div className="flex gap-3 items-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel required>Is Active</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(isEdit || isCreate) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-red-500 gap-1.5"
                      type="button"
                    >
                      <p>Remove</p>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure to remove this contact person?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Account {index + 1} will be removed from the customer's
                        contact person list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        className={buttonVariants({
                          variant: "destructive",
                        })}
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        Remove
                      </AlertDialogAction>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="grid grid-cols-3 gap-y-3 gap-x-5">
              <FormField
                control={form.control}
                name={`contacts.${index}.contactName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`contacts.${index}.phoneNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contacts.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          {(isEdit || isCreate) && (
            <Button
              variant="link"
              className=" text-orange-500 justify-start p-0"
              type="button"
              onClick={() => {
                append(defaultContact);
              }}
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Contact Person
            </Button>
          )}
          <Button
            variant="link"
            className=" text-orange-500 justify-start p-0"
            type="button"
            onClick={() => setTab("attachments")}
          >
            {contactAttachments.length > 0 ? (
              <>
                <Paperclip className="w-5 h-5 mr-1.5" />
                View {contactAttachments.length} Attachment(s)
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-1.5" />
                Add Attachment
              </>
            )}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
