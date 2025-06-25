import { OrgSelectSchemaDto } from "@/dtos/organization";
import { Context } from "@/server/context/context";
import { OrgsRepository } from "../repository";

export async function getOrgById(ctx: Context) {
	return OrgsRepository(ctx.db).getById(ctx.user.orgId).then(OrgSelectSchemaDto.parse);
}