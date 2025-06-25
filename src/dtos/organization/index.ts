import { OrgSelectSchema } from "@/server";
import { z } from "zod";
import { TypeFromZodSchema } from "@/server/utils/type";

export const selectByIdStringDto = z.object({
	id: z.string({ required_error: "Id is required" }).transform((x) => BigInt(x)),
});

export const OrgSelectSchemaDto = OrgSelectSchema

export type OrgSelectResSchema = TypeFromZodSchema<typeof OrgSelectSchemaDto>;
