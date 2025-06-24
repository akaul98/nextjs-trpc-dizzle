// src/db/index.ts
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { OTPModel } from './schema/otp';
import { UserModel } from './schema/user';
import { OrgModel } from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export type { PgTableWithColumns } from "drizzle-orm/pg-core";
export const drizzleConfigSchema = {
schema: {
  otp:OTPModel,
  user:UserModel,
  organization: OrgModel,

}
}

export const db = drizzle(pool, drizzleConfigSchema );

export type DBType = typeof db;

export type PgTransaction<T extends Record<string, any>> = NodePgTransaction<T, any>;

export type DB<T extends Record<string, any>> = DBType | PgTransaction<T>;

