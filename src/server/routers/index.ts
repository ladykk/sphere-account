import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { projectRouter } from "./project";
import { productRouter } from "./product";

export const appRouter = createTRPCRouter({
  test: publicProcedure.query((opts) => {
    return "test";
  }),
  auth: authRouter,
  project: projectRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
