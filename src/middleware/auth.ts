import { Request, Response, NextFunction } from "express";
import { accessPath, HTTP_METHODS, IContext, MiddlewareOpt, SelectType } from "../utils";

export function IsAuthenticated(
    ...excluded: HTTP_METHODS[]){

    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.path);
        if (excluded.includes(req.method as HTTP_METHODS)) next();

        else if (!req.session.user) throw new Error("Permission Denied");

        next();
    }
}

export function IsOwner(
    owner_path: string,
    getInstance: (request: Request) => Promise<IContext>,
    ...excluded: HTTP_METHODS[]
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (excluded.includes(req.method as HTTP_METHODS)) next();

        else{

            req.context = await getInstance(req);
            const { select } = req.context
            const instance = req.context[select as SelectType]

            if (accessPath(owner_path, instance as object) !== req.session.user?.id)
                throw new Error("Unauthorized");

                next();
        }
    }
}
