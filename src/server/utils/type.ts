import { z } from "zod";
import { PgTransaction } from "@/lib/drizzle";

export type TypeFromZodSchema<T extends z.ZodTypeAny> = z.infer<T>;

export type TypeCastRepositoryForTransaction<T extends (...args: any) => any> = (
	db: PgTransaction<any>,
	orgId: bigint
) => ReturnType<T>;
