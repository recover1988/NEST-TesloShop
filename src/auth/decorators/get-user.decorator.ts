import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";



export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContextHost) => {
        // console.log({ data })
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new InternalServerErrorException('User not found in request')
        return (!data) ? user : user[data];
    }
);