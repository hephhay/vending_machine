import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { MongoServerError } from "mongodb";

import { CustomError, NotFound } from "../errors";
import { HTTPStatusCodes, logger } from "../utils";

export const notFound = async (
    _: Request,
    __: Response
) => {

    throw new NotFound("Route does not exist");
};

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
export function handleError(
    err:  Error,
    req: Request,
    res: Response,
    next: NextFunction
) {

    let statusCode: HTTPStatusCodes
    let message: string;
    let details: object | null = null;

    if (err instanceof CustomError){

        statusCode = err.statusCode;
        message = err.message;
    }

    else if (err instanceof ZodError){

        message = "Invalid Input";
        statusCode = HTTPStatusCodes.BAD_REQUEST;
        details = JSON.parse(err.message);
    }

    else if(err instanceof MongoServerError){
        statusCode = HTTPStatusCodes.BAD_REQUEST,
        message = err.message;
    }

    else{

        statusCode = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
        message = "Server Error";

        logger.error(err.constructor.name);
        logger.error(err.stack);
    }

    res.status(statusCode)
        .send({
            status: "failed",
            message: message,
            details: details
        });
}
