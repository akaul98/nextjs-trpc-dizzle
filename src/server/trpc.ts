import { initTRPC } from '@trpc/server';
import { firebaseAdminInit } from './lib/firebaseAdmin';
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 * 
 */


firebaseAdminInit();
const t = initTRPC.create({});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const p = t.procedure;