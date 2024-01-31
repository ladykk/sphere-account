import { helpers } from "@/trpc/helpers";
import AccountClient from "./_component";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function AccountPage() {
  await helpers.auth.getAccountLoginOptions.prefetch();
  return (
    <HydrationBoundary state={helpers.dehydrate()}>
      <AccountClient />
    </HydrationBoundary>
  );
}
