"use client";

import { trpc } from "@/lib/trpc";

export default function Home() {
  const query = trpc.test.useQuery();
  return <main>{query.data}</main>;
}
