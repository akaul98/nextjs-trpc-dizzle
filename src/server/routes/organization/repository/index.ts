import { DBType } from "@/lib/drizzle";
import { OrgModel } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

const getById = async (db: DBType, id: bigint) => {
	return db.query.orgModel.findFirst({
		with: {
			orgProfile: true,
		},
		where: eq(OrgModel.id, id),
	});
};

export function OrgsRepository(db: DBType) {
	return {
		getById: (id: bigint) => getById(db, id),
	
	};
}