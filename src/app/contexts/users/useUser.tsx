"use client";

import { OrgSelectResSchema } from "@/dtos/organization";
import { auth } from "@/lib/firebase";
import { trpc } from "@/lib/client/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
export const useUser = () => {
	const [user, setUser] = useState<User | null>(null);
	const [org, setOrg] = useState<OrgSelectResSchema | null>(null);
	const [isUserLoading, setIsUserLoading] = useState(true);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (updatedUser) => {
			setIsUserLoading(false);
			setUser(updatedUser);
		});
		return () => unsubscribe();
	}, []);

	
	
	
	const { data, isLoading: isUserAccountLoading } = {
		data: {
			userAccount: user,
		},
		isLoading: isUserLoading,
	};

	const userAccount = useMemo(() => (data ? data.userAccount : null), [data]);
	const customClaims = JSON.parse((user as any)?.reloadUserInfo?.customAttributes || "{}");
	return {
		user,
		setUser,
		org,
		setOrg,
		isUserLoading,
		userAccount,
		isUserAccountLoading,
		uid: user?.uid,
		orgId: customClaims?.orgId,
		orgCode: customClaims?.orgCode,
	};
};

export type UseUser = ReturnType<typeof useUser>;
