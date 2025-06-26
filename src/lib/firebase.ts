"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Messaging } from "firebase/messaging";
import { getMessaging, isSupported } from "firebase/messaging/sw";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

let app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function isFirebaseError(error: unknown): error is { code: string } {
	return typeof error === "object" && error !== null && "code" in error;
}

const db = getFirestore(app);

const firebaseErrorRecord: Record<string, string> = {
	"auth/user-not-found": "No user associated with email",
	"auth/wrong-password": "Provided password is not valid",
};

// Conditionally initialize Messaging (only if supported in the browser)
let messaging: Messaging;
isSupported()
	.then((supported) => {
		if (supported) {
			messaging = getMessaging(app);
		} else {
			console.warn("Firebase Messaging is not supported in this environment.");
		}
	})
	.catch((error) => console.error("Error checking messaging support:", error));

export { app, auth, db, firebaseErrorRecord, isFirebaseError, messaging };
