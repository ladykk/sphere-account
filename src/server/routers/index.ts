import { publicProcedure, createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
});

export type AppRouter = typeof appRouter;
