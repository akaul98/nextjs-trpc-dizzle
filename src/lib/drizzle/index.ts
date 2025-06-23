// src/db/index.ts
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { OTPModel } from './schema/otp';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const drizzleConfigSchema = {
schema: {
  otp:OTPModel,

}
}

export const db = drizzle(pool, drizzleConfigSchema );

export type DBType = typeof db;

export type PgTransaction<T extends Record<string, any>> = NodePgTransaction<T, any>;

export type DB<T extends Record<string, any>> = DBType | PgTransaction<T>;

