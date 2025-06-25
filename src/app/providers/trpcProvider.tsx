"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/lib/client/client";
//import { auth } from "@/lib/firebase";

const url = `/api/trpc`;

export const TRPCProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 1000 * 60 * 2, // Data is fresh for 5 minutes
						retry: 2, // Retry failed queries twice
						refetchOnMount: true, // Refetch on mount
						refetchOnReconnect: true, // Refetch when reconnecting to the network
					},
				},
			})
	);

	const trpcClient = trpc.createClient({
		links: [
			httpBatchLink({
				url: url,
				transformer: superjson,
				// headers: async () => {
				// 	let token = await auth.currentUser?.getIdToken();
				// 	return {
				// 		authorization: token ? `Bearer ${token}` : "",
				// 	};
				// },
			}),
		],
	});

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}> {children}</QueryClientProvider>
		</trpc.Provider>
	);
};
