import { OrgSelectSchema } from "@/lib/drizzle/schema"
import { p } from "@/server/trpc"
import { Utility } from "@/server/utils/utility"
import { selectByIdStringDto } from "@/dtos/organization"
import { getOrgById } from "../logic/get.logic"

export const GetOrgById= p.input(selectByIdStringDto).output(OrgSelectSchema).query(async ({ ctx, input }) => 
  Utility.withErrorHandler(() => getOrgById(ctx), "Failed to fetch Organization"))

