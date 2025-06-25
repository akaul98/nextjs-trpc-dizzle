import { router } from "@/server/trpc";
import { GetOrgById } from "./routes/route";

export const OrgRoutes= router({
  get:GetOrgById,
});

export type OrgRouter = typeof router;