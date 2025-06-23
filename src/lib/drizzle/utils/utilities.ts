import { customType } from "drizzle-orm/pg-core";
import crypto from "crypto";

type NumericConfig = {
	precision?: number;
	scale?: number;
};

export const numericCasted = customType<{
	data: number;
	driverData: string;
	config: NumericConfig;
}>({
	dataType: (config) => {
		if (config?.precision && config?.scale) {
			return `numeric(${config.precision}, ${config.scale})`;
		}
		return "numeric";
	},
	fromDriver: (value: string) => Number.parseFloat(value),
	toDriver: (value: number) => value.toString(),
});

export function surlHashGen(url: string, salt: string = "", length: number = 8): string {
	// Combine the URL and salt
	const input = `${url}${salt}`;
	const hash = crypto.createHash("sha256").update(input).digest("base64");
	return hash.replace(/[/+=]/g, "").substring(0, length);
}

export const tsVector = customType<{ data: string }>({
	dataType() {
		return "tsvector";
	},
});

export type DistanceFunction = "COSINE" | "DOT" | "L2" | "L2_SQUARED";

export const pgVector = customType<{
	data: ArrayBuffer;
	config: { length: number };
	configRequired: true;
	driverData: Buffer;
}>({
	dataType(config) {
		return `vector(${config.length})`;
	},
	fromDriver(value) {
		return value.buffer as ArrayBuffer;
	},
	toDriver(value) {
		return Buffer.from(value);
	},
});
