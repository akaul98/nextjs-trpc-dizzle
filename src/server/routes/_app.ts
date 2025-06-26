import { router } from "../trpc";
import { OrgRoutes } from "./organization/_handler";
import { UserRoutes } from "./users/_handler";
import { LoginRoutes } from "./login/_handler";

export const appRouter=router({
  org:OrgRoutes,
 // user:UserRoutes,
  login:LoginRoutes,
})


export type AppRouter = typeof appRouter;