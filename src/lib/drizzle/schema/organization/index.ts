import { BaseSchemaFormOrg } from "@/lib/drizzle/schema/shared";
import { relations, sql } from "drizzle-orm";
import { bigint } from "drizzle-orm/pg-core";
import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const OrgModel = pgTable("organization", {
	...BaseSchemaFormOrg(),
	name: varchar("name", { length: 100 }).notNull(),
	orgCode: varchar("org_code", { length: 10 }).notNull(),
	registeredName: varchar("registered_name", { length: 100 }).default(""),
	cin: varchar("cin", { length: 20 }).default(""),
	email: varchar("email", { length: 100 }).default(""),
	cc: jsonb("udf").default(sql`'[]'::jsonb`),
	contactPersonName: varchar("contact_person_name", { length: 100 }).default(""),
	website: varchar("website", { length: 100 }).default(""),
	phone1: varchar("phone1", { length: 20 }).default(""),
	phone2: varchar("phone2", { length: 20 }).default(""),
	gstNumber: varchar("gst_number", { length: 20 }).default(""),
	pan: varchar("pan", { length: 20 }).default(""),
	group: jsonb("group"),
	billingAddress: jsonb("billing_address").default(sql`'{}'::jsonb`),
	shippingAddress: jsonb("shipping_address").default(sql`'{}'::jsonb`),
	bankName: varchar("bank_name", { length: 100 }).default(""),
	ifsc: varchar("ifsc", { length: 20 }).default(""),
	accountNumber: varchar("account_number", { length: 20 }).default(""),
	branch: varchar("account_number", { length: 20 }).default(""),
	upi: varchar("upi", { length: 50 }).default(""),
	plan: integer("plan").notNull(),
});

export const OrgInsertSchema = createInsertSchema(OrgModel, {
	 createdAt: (w) => w.createdAt.default(Date.now()),
	 id: z.bigint(),
});

export const OrgUpdateSchema = createInsertSchema(OrgModel, {
	 updatedAt: (w) => w.updatedAt.default(Date.now()),
	 id: z.bigint(),
});

export const OrgSelectSchema = createSelectSchema(OrgModel,{
	id: z.bigint()
});

export const OrgDeleteSchema = createInsertSchema(OrgModel, {
	 deletedAt: (w) => w.deletedAt.default(Date.now()),
	 id: z.bigint(),
});


export type Organization = typeof OrgModel.$inferSelect;
