import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routes/_app";
import { createContext } from "@/server/context/context";
const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: async () => await createContext(),
		onError(opts) {
			const { error, type, path, input, ctx, req } = opts;
			console.error(error);
			return error.code === "BAD_REQUEST"
				? (error.cause as any)?.error?.issues.map((x: any) => ({ [x.path.join("_")]: x.message }))
				: null;
		},
	});

export { handler as GET, handler as POST };
