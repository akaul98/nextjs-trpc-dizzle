import { loginReqDto, loginResDto } from "@/dtos/login";
import { p } from "@/server/trpc";
import { Utility } from "@/server/utils/utility";
import { loginLogic } from "../logic/login.logic";

export const LoginUser=p.input(loginReqDto).output(loginResDto).mutation(({ ctx, input }) =>  Utility.withErrorHandler(() => loginLogic(ctx, input), "Login failed"));