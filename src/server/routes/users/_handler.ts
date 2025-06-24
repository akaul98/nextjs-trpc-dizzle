import { router } from "@/server/trpc";

export const UserRoutes= router({
  get:getUserList,
  getById:getUserById,
  create:createUser,
  update:updateUser,
  delete:deleteUser,


});

export type UserRouter = typeof router;