import { z } from "zod";

export const imgZodSchema = z
	.array(
		z.object({
			src: z.string().optional(),
			alt: z.string().default("").optional(),
		})
	)
	.optional();

export const BaseImageAttachmentNoteZodSchema = () => ({
	images: imgZodSchema,
	attachments: imgZodSchema,
	note: z.string().optional(),
});
export const BaseDocZodSchema = () => ({
	tags: z.array(z.string()).optional(),
	...BaseImageAttachmentNoteZodSchema(),
});

export const decimalSchema = () =>
	z
		.union([z.string().regex(/^-?\d+(\.\d{1,})?$/, "Invalid decimal format"), z.number()])
		.transform((val) => (typeof val === "string" ? parseFloat(val) : val))
		.pipe(z.number())
		.optional()
		.default(0);
