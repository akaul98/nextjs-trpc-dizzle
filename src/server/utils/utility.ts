
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const Utility = {
	validateSchema: <T>(schema: z.Schema, data: T) => {
		try {
			return schema.parse(data);
		} catch (error) {
			throw new Error((error as any).message);
		}
	},
	generateRandomNumber: (digit: number) => {
		return Math.floor(Math.pow(10, digit - 1) + Math.random() * 9 * Math.pow(10, digit - 1));
	},
	nextNo: (invoiceNo: string) => {
		const regex = new RegExp(/\d+/g);
		const m = invoiceNo.match(regex) || [];
		const lastNumber = m.pop() || 0;
		let x;
		let parsedNumber;
		let parsedNumberStr;
		let prevNoLength;
		let currentNoLength;
		let prefix = "";
		let prefLastChar = "";

		parsedNumber = ~~lastNumber;
		parsedNumberStr = parsedNumber + "";
		x = parsedNumber + 1;

		prefix = invoiceNo.substring(0, invoiceNo.lastIndexOf(parsedNumberStr));

		prevNoLength = (x - 1 + "").length;
		currentNoLength = (x + "").length;
		if (currentNoLength > prevNoLength) {
			if (prefix.length > 0) {
				prefLastChar = prefix.substring(prefix.length - 1);
				if (prefLastChar === "0") {
					prefix = prefix.substring(0, prefix.length - 1);
				}
			}
		}
		return prefix + x;
	},
	convertToArray: <T>(d: T | T[]) => {
		return Array.isArray(d) ? d : Array(d);
	},
	
	removeUndefined: <T>(obj: T): T => {
		const removeUndefined = (obj: any): any => {
			if (Array.isArray(obj)) {
				return obj.map((item) => removeUndefined(item)).filter((item) => item !== undefined);
			} else if (typeof obj === "object" && obj !== null) {
				return Object.fromEntries(
					Object.entries(obj)
						.map(([key, value]) => [key, removeUndefined(value)])
						.filter(([, value]) => value !== undefined)
				);
			}
			return obj;
		};
		return removeUndefined(obj);
	},
	convertAnyToCurrentMillis: (input: string | Date | number): number => {
		if (typeof input === "number") {
			return input;
		}

		if (input instanceof Date) {
			return input.getTime();
		}

		if (typeof input === "string") {
			try {
				// Remove ordinal indicators and clean input
				const cleanedInput = input.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();

				// Common date formats in Indian documents
				const formats = [
					/(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
					/(\d{2})\.(\d{2})\.(\d{4})/, // DD.MM.YYYY
					/(\d{4})\.(\d{2})\.(\d{2})/, // YYYY.MM.DD
					/(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
					/(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
					/(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
					/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i, // DD MMM YYYY
					/(\d{4})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})/i, // YYYY MMM DD
					/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\s*,?\s*(\d{4})/i, // MMM DD YYYY
				];

				// Month name to number mapping
				const monthMap: { [key: string]: number } = {
					jan: 0,
					feb: 1,
					mar: 2,
					apr: 3,
					may: 4,
					jun: 5,
					jul: 6,
					aug: 7,
					sep: 8,
					oct: 9,
					nov: 10,
					dec: 11,
				};

				for (const format of formats) {
					const match = cleanedInput.match(format);
					if (match) {
						let day, month, year;

						// Handle numeric date formats
						if (format === formats[0] || format === formats[1] || format === formats[3]) {
							[, day, month, year] = match;
							month = parseInt(month || "0") - 1; // Convert to 0-based month
						} else if (format === formats[5]) {
							[, month, day, year] = match;
							month = parseInt(month || "0") - 1;
						} else if (format === formats[2] || format === formats[4]) {
							[, year, month, day] = match;
							month = parseInt(month || "0") - 1;
						}
						// Handle text month formats
						else if (format === formats[6]) {
							// DD MMM YYYY
							[, day, month, year] = match;
							month = monthMap[month?.toLowerCase().substring(0, 3) || "0"];
						} else if (format === formats[7]) {
							// YYYY MMM DD
							[, year, month, day] = match;
							month = monthMap[month?.toLowerCase().substring(0, 3) || "0"];
						} else if (format === formats[8]) {
							// MMM DD YYYY
							[, month, day, year] = match;
							month = monthMap[month?.toLowerCase().substring(0, 3) || "0"];
						}

						const parsedDate = new Date(
							parseInt(year || "0"),
							month || 0,
							parseInt(day || "0"),
							23,
							59,
							59,
							999
						) as Date;

						// Validate the parsed date
						if (
							!isNaN(parsedDate.getTime()) &&
							parsedDate.getMonth() === month &&
							parsedDate.getDate() === parseInt(day || "0")
						) {
							return parsedDate.getTime();
						}
					}
				}

				// Try native Date parsing as fallback
				const parsedDate = new Date(cleanedInput);
				if (!isNaN(parsedDate.getTime())) {
					parsedDate.setHours(23, 59, 59, 999);
					return parsedDate.getTime();
				}

				// If no valid date format is found, return the original input as a number
				return Number(input) || 0;
			} catch (error) {
				// If any error occurs during parsing, return the original input as a number
				return Number(input) || 0;
			}
		}

		// If input is neither number, Date, nor string, return 0
		return 0;
	},

	withErrorHandler: async <T>(operation: () => Promise<T>, errorMessage: string): Promise<T> => {
		try {
			return await operation();
		} catch (error) {
 			if (error instanceof TRPCError) {
				throw error;
			}
			throw new TRPCError({
				message: errorMessage,
				code: "INTERNAL_SERVER_ERROR",
				cause: error,
			});
		}
	},
};
