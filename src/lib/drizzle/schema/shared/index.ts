import { GenerateSnowflakeId, SnowflakeGenerator } from "@/lib/drizzle/utils/snowflakeId";
import { bigint } from "drizzle-orm/pg-core";

const snowflakeGenerator = new SnowflakeGenerator(1); // Use your machine ID

export function BaseSchemaForUserSchema() {
	return {
		id: bigint("id", { mode: "bigint" })
			.primaryKey()
			.$defaultFn(() => GenerateSnowflakeId(1))
			.notNull(),
		createdAt: bigint("created_at", { mode: "number" }).notNull().$defaultFn(Date.now),
		updatedAt: bigint("updated_at", { mode: "number" }).default(0),
		deletedAt: bigint("deleted_at", { mode: "number" }).default(0),
	};
}

export function BaseSchemaFormOrg() {
	return {
		...BaseSchemaForUserSchema(),
	};
}
