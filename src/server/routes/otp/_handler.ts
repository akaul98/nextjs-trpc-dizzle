import { router } from "@/server/trpc";

export const OtpRoutes= router({
  otpSent:sentOtp,
  otpVerify:verifyOtp,
  otpResend:resendOtp,



});

export type OtpRouter = typeof router;