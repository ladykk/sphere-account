import { api } from "@/trpc/react";

export function AuthMetadata(props: { userId: string | null }) {
  const query = api.auth.getUserMetadataInfo.useQuery(props.userId ?? "", {
    enabled: !!props.userId,
  });

  return !props.userId ? "Removed User" : query.data?.name;
}
