import { initTRPC } from '@trpc/server';
import { firebaseAdminInit } from './lib/firebaseAdmin';
import { createContext } from './context/context';
import superjson from 'superjson'; 

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 * 
 */


firebaseAdminInit();
const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
	errorFormatter(opts) {
		const { shape, error } = opts;
		console.error(error); // Log the error details here
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST"
						? (error.cause as any)?.error?.issues?.map((x: any) => ({ [x.path.join("_")]: x.message }))
						: null,
			},
		};
	},
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const p = t.procedure;