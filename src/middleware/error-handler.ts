import { Request, Response, NextFunction } from "express";

import { HTTPStatusCodes } from "../utils";

const notFound = (
    _: Request,
    res: Response
) => res.status(HTTPStatusCodes.NOT_FOUND)
        .send({'details': 'Route does not exist'});

export { notFound }
