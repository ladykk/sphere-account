import { appRouter } from "@/server/routers";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContext } from "./server";

export const helpers = createServerSideHelpers({
  router: appRouter,
  ctx: await createContext(),
});
