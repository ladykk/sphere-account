import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { employeeRouter } from "./employee";
import { projectRouter } from "./project";
import { productRouter } from "./product";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
  auth: authRouter,
  project: projectRouter,
  product: productRouter,
  employee: employeeRouter,

});

export type AppRouter = typeof appRouter;
