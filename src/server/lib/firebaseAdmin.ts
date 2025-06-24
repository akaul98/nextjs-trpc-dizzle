import admin from "firebase-admin";

import { getApps, initializeApp } from "firebase-admin/app";

export function firebaseAdminInit() {
	if (!getApps().length) {
		initializeApp({
			credential: admin.credential.cert(process.env.NEXT_FB_SERVICE_ACCOUNT_KEY as string),
		});
	}
}

export const adminAuth: () => admin.auth.Auth = () => admin.auth();

export const adminDB = () => admin.firestore();

export const FirebaseUtils = () => ({
	docId: () => admin.firestore().collection("blankIds").doc().id,
});
