import { getAuth } from "firebase-admin/auth";

// Function to verify a token
const verifyToken = (token: string) => {
	return getAuth()
		.verifyIdToken(token)
		.catch((error) => {
			throw new Error(`Token verification failed: ${error.message}`);
		});
};

// Function to verify a token and check if it is revoked
const verifyTokenWithRevocationCheck = (token: string) => {
	return getAuth()
		.verifyIdToken(token, true)
		.catch((error) => {
			if (error.code === "auth/id-token-revoked") {
				throw new Error("Token revoked");
			} else {
				throw new Error("Token not valid");
			}
		});
};

// Function to check if a token is valid
const isValidToken = (token?: string) => {
	if (!token) {
		throw new Error("Token is required");
	}
	return verifyToken(token);
};

// Function to create a custom token
const registerToken = (uid: string, payload: { [key: string]: any }) => {
	return getAuth().createCustomToken(uid, payload);
};

// Function to revoke a token
const revokeToken = (token: string) => {
	return getAuth().revokeRefreshTokens(token);
};

export const Token = {
	verifyToken,
	verifyTokenWithRevocationCheck,
	isValidToken,
	registerToken,
	revokeToken,
};
