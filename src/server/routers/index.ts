import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
