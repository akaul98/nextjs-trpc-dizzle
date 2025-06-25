
import { TypeFromZodSchema } from "@/server/utils/type";
import { z } from "zod";

export const loginReqDto = z.object({
	phone: z
		.string()
		.min(10, {
			message: "Phone number must be 10 digits.",
		})
		.regex(/^[6-9]\d{9}$/, {
			message: "Phone number must be numeric.",
		}),
	otp: z
		.string()
		.max(6, {
			message: "OTP must be 6 digits.",
		})
		.regex(/^[0-9]+$/, {
			message: "OTP must be numeric.",
		})
		.optional(),
	orgCode: z.string({
		message: "Organization code is required.",
	}),
});

export type LoginReqDto = TypeFromZodSchema<typeof loginReqDto>;

export const loginResDto = z.object({
	token: z.string().optional(),
	msg: z.string(),
});

export type loginResDto = TypeFromZodSchema<typeof loginResDto>;
