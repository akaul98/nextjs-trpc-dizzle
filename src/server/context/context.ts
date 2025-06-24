import { Token } from "@/server/lib/token";
//import { UserRepository } from "@/trpc/server/routes/master/users/repository/user.repository";
import { db, Organization, UserModelType } from "@/server";
import { headers } from "next/headers";

export interface Context {
	db: typeof db;
	user: UserModelType & { org: Organization };
}

export async function createContext(): Promise<Context> {
	// const session = await auth()
	const obj: any = { db: db };
	const token = (await headers()).get("authorization")?.toString()?.replace("Bearer ", "");
	if (token) {
		const isValidToken = await Token.isValidToken(token);
		if (isValidToken?.orgId) {
			const user = await UserRepository(db, BigInt(isValidToken.orgId)).getDocWithOrgById({
				id: BigInt(isValidToken.uid),
			});
			if (user) {
				obj.user = user;
			}
		}
	}
	return obj;
}
