import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { employeeRouter } from "./employee";
import { projectRouter } from "./project";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
  auth: authRouter,
  project: projectRouter,
  employee: employeeRouter,
});

export type AppRouter = typeof appRouter;
