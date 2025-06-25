import { LoginReqDto } from "@/dtos/login";
import { DBType } from "@/lib/drizzle";
import {
  OrgModel,
  OTPModel,
  UserModel,
  UserModelType,
} from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

const handleOTPOperations = <T extends Record<string, any>>(db: DBType) => ({
  save: async (user: UserModelType) => {
    return db
      .insert(OTPModel)
      .values({
        orgId: user.orgId,
        phone: user.phone,
      })
      .onConflictDoUpdate({
        target: [OTPModel.phone, OTPModel.orgId],
        set: {
          updatedAt: Date.now(),
        },
      })
      .returning();
  },

  get: async ({
    phone,
    otp,
    orgId,
  }: {
    phone: string;
    otp: string;
    orgId: bigint;
  }) => {
    return db
      .select({
        otp: OTPModel.otp,
        phone: OTPModel.phone,
        id: OTPModel.id,
      })
      .from(OTPModel)
      .innerJoin(
        UserModel,
        and(
          eq(UserModel.phone, OTPModel.phone),
          eq(UserModel.orgId, OTPModel.orgId)
        )
      )
      .where(
        and(
          eq(OTPModel.phone, phone),
          eq(OTPModel.orgId, orgId),
          eq(OTPModel.otp, otp)
        )
      );
  },
});

const getAccountForLogin = async <T extends Record<string, any>>(
  db: DBType,
  { phone, orgCode }: { phone: string; orgCode: string }
) => {
  const results = await db
    .select()
    .from(UserModel)
    .innerJoin(OrgModel, eq(UserModel.orgId, OrgModel.id))
    .where(and(eq(UserModel.phone, phone), eq(OrgModel.orgCode, orgCode)))
    .limit(1);

  const user = results[0];
  if (!user) return null;
  return {
    ...user.users,
    org: user.organization,
  };
};


export function LoginRepository(db: DBType) {
  const otpHandler = handleOTPOperations(db);

  return {
    otpOperations: {
      save: (user: UserModelType) => otpHandler.save(user),
      get: (params: { phone: string; otp: string; orgId: bigint }) =>
        otpHandler.get(params),
    },
    getAccountForLogin: (data: Pick<LoginReqDto, "phone" | "orgCode">) =>
      getAccountForLogin(db, data),
  };
}
