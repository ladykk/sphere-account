import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BlockInteraction, Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

// Assets
import password from "@/assets/icon/padlock.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { handleTRPCFormError } from "@/lib/utils";
export function ChangePassword() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const query = api.auth.getAccountLoginOptions.useQuery();

  const form = useForm<RouterInputs["auth"]["registerPassword"]>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = api.auth.registerPassword.useMutation({
    onSuccess: () => {
      form.reset({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey(api.auth.getAccountLoginOptions),
      });
    },
    onError: (error) =>
      handleTRPCFormError(error.data?.zodError, form.setError),
  });

  const onSubmit = async (data: RouterInputs["auth"]["registerPassword"]) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Changing password...",
      success: "Password changed successfully",
      error: "Failed to change password",
    });
  };

  const isPreparing = query.isLoading || status === "loading";

  return (
    <Form {...form}>
      <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
        <BlockInteraction isBlock={mutation.isPending} />
        <div className="flex items-center mb-3">
          <h3>{query.data?.password ? "Change" : "Set"} Password</h3>
          {isPreparing && <Spinner className="ml-2" />}
        </div>
        {!isPreparing &&
          (!!session?.user.email ? (
            <div className="space-y-3">
              {query.data?.password && (
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          prefixIcon={password}
                          type="password"
                          placeholder="Old Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        prefixIcon={password}
                        type="password"
                        placeholder="New Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        prefixIcon={password}
                        type="password"
                        placeholder="Confirm New Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={!form.formState.isDirty}>Change</Button>
            </div>
          ) : (
            <p>Please update account's email address before set password.</p>
          ))}
      </form>
    </Form>
  );
}
