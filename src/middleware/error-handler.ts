import { Request, Response } from "express";

import { HTTPStatusCodes } from "../utils";

export const notFound = async (
    _: Request,
    res: Response
) => res.status(HTTPStatusCodes.NOT_FOUND)
        .send({'details': 'Route does not exist'});

