import { router } from "@/server/trpc";
import { LoginUser } from "./routes/route";

export const LoginRoutes= router({
logn:LoginUser


});

export type OtpRouter = typeof router;