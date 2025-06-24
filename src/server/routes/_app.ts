import { router } from "../trpc";
import { OrgRoutes } from "./organization/_handler";
import { UserRoutes } from "./users/_handler";
import { OtpRoutes } from "./otp/_handler";

export const appRouter=router({
  org:OrgRoutes,
  user:UserRoutes,
  otp:OtpRoutes,
})