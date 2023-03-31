import { Request, Response, NextFunction } from "express";

import { NotAuthenticated, PermissionDenied } from "../errors";
import {
    accessPath,
    HTTP_METHODS,
    HTTP_SAFE_METHODS,
    IContext,
    Roles,
    SelectType
} from "../utils";

const exclude = (
    req: Request,
    exclude_methods: HTTP_METHODS[],
    exclude_paths: string[],
) =>
    (exclude_methods.includes(req.method as HTTP_METHODS)) || 
    (exclude_paths.includes(req.path));


export function IsAuthenticated(
    exclude_methods: HTTP_METHODS[] = [],
    exclude_paths: string[] = []
){

    return async (req: Request, res: Response, next: NextFunction) => {

        if (exclude(req, exclude_methods, exclude_paths)) return next();

        if (!req.session.user) throw new NotAuthenticated();

        return next();
    }
}

export function IsOwner(
    owner_path: string,
    getInstance: (request: Request) => Promise<IContext>,
    exclude_methods: HTTP_METHODS[] = [],
    exclude_paths: string[] = []
) {
    return async (req: Request, res: Response, next: NextFunction) => {

        if (exclude(req, exclude_methods, exclude_paths)) return next();

        req.context = await getInstance(req);
        const { select } = req.context;
        const instance = req.context[select as SelectType];

        if (accessPath(
            owner_path,
            instance as object
        ) !== req.session.user?.id) throw new PermissionDenied();

        return next();

    }
}

export async function IsBuyer(
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (req.session.user?.role === Roles.BUYER) return next();

    throw new PermissionDenied("User is not a Buyer");
}

export async function IsSeller(

    req: Request,
    res: Response,
    next: NextFunction
) {

    if (HTTP_SAFE_METHODS.includes(req.method as HTTP_METHODS)) return next();

    if (req.session.user?.role === Roles.SELLER) return next();

    throw new PermissionDenied("User is not a Seller");
}
