import { PgTransaction } from "@/lib/drizzle/index";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

type cbType<T extends Record<string, unknown>, K> = (params: { tx: PgTransaction<T>; repo: K }) => Promise<any>;

export const Transaction = <T extends Record<string, unknown>, K>(
	{ db, orgId }: { db: NodePgDatabase<T>; orgId: bigint },
	repoFn: (tx: PgTransaction<T>, orgId: bigint) => K
) => {
	const cbHandler = (transaction: cbType<T, K>) => {
		return db.transaction(
			async (tx) => {
				const repo = repoFn(tx, orgId);
				return transaction({ repo, tx });
			},
			{
				isolationLevel: "read uncommitted",
			}
		);
	};
	return cbHandler;
};
