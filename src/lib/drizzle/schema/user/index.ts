import {
  bigint,
  pgEnum,
  pgTable,
  varchar,
  text,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { or, relations, sql } from "drizzle-orm";
import { BaseSchemaForUserSchema } from "@/lib/drizzle/schema/shared";
import { jsonb } from "drizzle-orm/pg-core";
import { BaseDocZodSchema } from "@/lib/drizzle/schema/shared/zodSchema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { OrgModel } from "../organization";

export const GENDER_VALUES = ["m", "o", "f"] as const;
export const STATUS_VALUES = ["active", "inactive", "cancelled"] as const;

export const genderEnum = pgEnum("gender_enum", GENDER_VALUES);
export const statusEnum = pgEnum("status_enum", STATUS_VALUES);

export const UserModel = pgTable("users", {
  ...BaseSchemaForUserSchema(),
  name: varchar("name", { length: 255 }).notNull(),
  orgId: bigint("orgId", { mode: "bigint" })
    .references(() => OrgModel.id)
    .notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  code: varchar("code", { length: 20 }).notNull(),
  designation: varchar("designation", { length: 100 }),
  gender: genderEnum("gender").notNull(),
  dob: bigint("dob", { mode: "number" }).default(0),
  photo: varchar("photo", { length: 255 }),
  status: statusEnum("status").default("active"),
  isVerificationCodeSent: bigint("is_verification_code_sent", {
    mode: "number",
  }).default(0),
  isVerified: bigint("is_verified", { mode: "number" }).default(0),
  cancelledAt: bigint("cancelled_at", { mode: "number" }).default(0),
  cancelledById: bigint("cancelled_by_id", { mode: "bigint" }).references(
    (): AnyPgColumn => UserModel.id
  ),
  createdById: bigint("created_by_id", { mode: "bigint" })
    .references((): AnyPgColumn => UserModel.id)
    .notNull(),
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => Date.now()),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  attachments: jsonb("attachments").default(sql`'[]'::jsonb`),
  note: text("note").default(""),
});

export const UserInsertSchema = createInsertSchema(UserModel, {
	createdAt: (w) => w.createdAt.default(Date.now()),
	...BaseDocZodSchema(),
});


const documentUpdateSchemaCleaning = <T extends Record<string, any>>(zod: z.ZodObject<T>, options?: { omit?: (keyof T)[] }) => {
	const omitFields: any = {
		createdAt: true,
		createdById: true,
		orgId: true,
		id: true,
		searchText: true,
		embedding: true,
		...(options?.omit?.reduce((acc, key) => {
			acc[key] = true;
			return acc;
		}, {} as any) || {}),
	};

	return zod
		.partial()
		.omit(omitFields as any)
		.transform((data) => Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)));
};


export const UserUpdateSchema = documentUpdateSchemaCleaning(UserInsertSchema);

export const UserSelectSchema = createInsertSchema(UserModel, {
	...BaseDocZodSchema(),
});

export const UserDeleteSchema = createInsertSchema(UserModel, {
	deletedAt: (w) => w.deletedAt.default(Date.now()),
	id: z.bigint(),
});

export type UserModelType = typeof UserModel.$inferSelect;

export type UserInsertType = z.infer<typeof UserInsertSchema>;

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

export type Gender = typeof UserModel.$inferSelect.gender;


export const UserRelations=relations(UserModel, ({ one,many }) => ({
  org: one(OrgModel, {
    fields: [UserModel.orgId],
    references: [OrgModel.id],
  }),
  createdBy: one(UserModel, {
    fields: [UserModel.createdById],
    references: [UserModel.id],
  }),
  cancelledBy: one(UserModel, {
    fields: [UserModel.cancelledById],
    references: [UserModel.id],
  }),
}));
