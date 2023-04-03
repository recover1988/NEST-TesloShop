import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";



export const RawHeader = createParamDecorator(
    (data: string, ctx: ExecutionContextHost) => {
        // console.log({ data })
        const req = ctx.switchToHttp().getRequest();
        const rawHeader = req.rawHeaders;

        if (!rawHeader) throw new InternalServerErrorException('User not found in request')
        return rawHeader;
    }
);