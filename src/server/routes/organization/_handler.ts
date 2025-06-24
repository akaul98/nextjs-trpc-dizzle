import { router } from "@/server/trpc";

export const OrgRoutes= router({
  get:getOrgById,
});

export type OrgRouter = typeof router;