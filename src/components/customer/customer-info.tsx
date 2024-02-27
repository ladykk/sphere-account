import { api } from "@/trpc/react";

export function CustomerMetadata(props: { customerId: string | null }) {
  const query = api.customer.getCustomerMetadataInfo.useQuery(
    props.customerId ?? "",
    {
      enabled: !!props.customerId,
    }
  );

  return !props.customerId ? "Removed Customer" : query.data;
}
