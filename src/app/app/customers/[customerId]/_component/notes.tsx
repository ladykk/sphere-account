import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { AutoSizeTextarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormInput } from "../page";

type Props = {
  tabContentClassName: string;
  form: UseFormReturn<FormInput>;
};

export const NoteTab = ({ tabContentClassName, form }: Props) => {
  return (
    <TabsContent value="notes" className={tabContentClassName}>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl>
              <AutoSizeTextarea
                {...field}
                value={field.value ?? ""}
                className=" min-h-96"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
};
