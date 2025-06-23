import { randomInt } from "crypto";
import { unique } from "drizzle-orm/pg-core";

import { integer, varchar, bigint, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { BaseSchemaFormOrg } from "../shared";
import { OrgModel } from "../organization";

export const OTPModel = pgTable("Otp", {
		...BaseSchemaFormOrg(),
		orgId: bigint("org_id", { mode: "bigint" })
			.notNull()
			.references(() => OrgModel.id),
		otp: varchar("otp", { length: 7 })
			.notNull()
			.$defaultFn(() => randomInt(99999).toString()),
		phone: varchar("phone", { length: 15 }).notNull(),
		createdAt: integer("created_at").$defaultFn(() => Math.floor(Date.now() / 1000)),
		expiresAt: bigint("expires_at", { mode: "number" }).$defaultFn(() => Date.now() + 6e4 * 10),
	},
	(t) => [unique().on(t.phone, t.orgId)]
);

export const OTPInsertSchema = createInsertSchema(OTPModel, 
	{
		createdAt: (w) => w.createdAt.default(Date.now()),
		id: z.bigint(),
});


export const OTPSelectSchema = createSelectSchema(OTPModel);

export type OTPModelType = typeof OTPModel.$inferSelect;
