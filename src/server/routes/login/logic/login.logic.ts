import { LoginReqDto, loginResDto } from "@/dtos/login";
import { OTPModelType } from "@/lib/drizzle/schema";
import { Context } from "@/server/context/context";
import { adminAuth } from "@/server/lib/firebaseAdmin";
import { TRPCError } from "@trpc/server";
import { LoginRepository } from "./repository/login.repository";

export async function loginLogic(
  ctx: Context,
  input: LoginReqDto
): Promise<loginResDto> {
  return input.otp ? verifyOtp(ctx, input as any) : sendOtp(ctx, input);
}

async function sendOtp(
  ctx: Context,
  input: Pick<LoginReqDto, "phone" | "orgCode">
) {
  const account = await verifyAccount(ctx, input);
  if (!account?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User/Password Not Found",
    });
  }
  try {
    const otpData = await LoginRepository(ctx.db)
      .otpOperations.save(account)
      .then((x) => x?.[0]);
    if (!otpData?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send OTP",
      });
    }
    const otpStatus = await sendOtpMsg(otpData);
    return { msg: otpStatus };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: String(error),
    });
  }
}

//need to clean code setup a cloud fucntion or a package with enums
function sendOtpMsg(otp: OTPModelType): Promise<string> {
	if (!process?.env?.SERVER_MSG_91_SMS_AUTHKEY) {
		throw new Error("need MSG91AuthKey");
	}
	return fetch("https://control.msg91.com/api/v5/flow", {
		method: "POST",
		headers: new Headers({
			"Content-Type": "application/json",
			accept: "application/json",
			authkey: process.env.SERVER_MSG_91_SMS_AUTHKEY,
		}),
		body: JSON.stringify({
			template_id: "66cd6faad6fc054bd21eb9a2",
			short_url: "0",
			recipients: [
				{
					mobiles: "91" + otp.phone,
					otp: otp.otp,
					site: "app.inventoryflow.in",
				},
			],
		}),
	})
		.then((x) => x.json())
		.then((x) => {
			return x.type;
		});
}

function verifyAccount(ctx: Context, data: Pick<LoginReqDto, "phone" | "orgCode">) {
	return LoginRepository(ctx.db).getAccountForLogin(data);
}

async function verifyOtp(ctx: Context, input: LoginReqDto & { otp: string }) {
	const account = await verifyAccount(ctx, input);
	if (!account?.id) {
		throw new Error("User not found");
	}

	const isValid = await validateOtp(ctx, { phone: account.phone, otp: input.otp, orgId: account.orgId });
	if (!isValid) {
		throw new Error("OTP not valid");
	}

	const token = await generateToken(account);
	if (!token) {
		throw new Error("Token could not be generated");
	}

	return { token, msg: "Login successful" };
}

async function generateToken(user: NonNullable<Awaited<ReturnType<typeof verifyAccount>>>): Promise<string> {
	let fbUser = await adminAuth()
		.getUser(String(user.id))
		.catch((e) => null);

	if (!fbUser) {
		fbUser = await adminAuth().createUser({
			uid: String(user.id),
			email: user.email || undefined,
			emailVerified: true,
			displayName: user.name,
		});
		await adminAuth().setCustomUserClaims(String(user.id), {
			orgId: String(user.orgId),
			orgCode: user.org.orgCode,
		});
	}

	return adminAuth().createCustomToken(String(user.id), {
		orgId: String(user.orgId),
		orgCode: user.org.orgCode,
	});
}


async function validateOtp(ctx: Context, input: { otp: string; orgId: bigint; phone: string }) {
	const otpData = await LoginRepository(ctx.db)
		.otpOperations.get({ phone: input.phone, otp: input.otp, orgId: input.orgId })
		.then((x) => x?.[0]);
	return Boolean(otpData?.id);
}

