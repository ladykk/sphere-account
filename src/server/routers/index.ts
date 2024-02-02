import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { projectRouter } from "./project";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
  auth: authRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
