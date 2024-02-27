import { publicProcedure, createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { employeeRouter } from "./employee";
import { projectRouter } from "./project";
import { productRouter } from "./product";
import { customerRouter } from "./customer";
import { rdAPIRouter } from "./rd-api";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  project: projectRouter,
  product: productRouter,
  employee: employeeRouter,
  customer: customerRouter,
  rdApi: rdAPIRouter,
});

export type AppRouter = typeof appRouter;
