import { Server } from "http";
import { Document } from "mongoose";

import { disconnectCache, redisClient, redisClientSub } from "../cache";
import { disconnectDB } from "../db";
import { logger } from "./logging";
import { RowRecord } from "./types";


export function isPositive(val: number) {
    return val >= 0
}

export function isMultiple(val: number, base: number){
    return val % base === 0
}

export function removeItem<T>(arr: Array<T>, value: T): Array<T> { 
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function gracefulShutdown(server: Server) {
    return (signal: any) => {
        logger.info(`Recieved signal ${signal}`);
        logger.info("Gracefully Shutting down server");
        server.close(() => {
            disconnectCache(redisClient, redisClientSub)
                .then(() => disconnectDB())
                .then(() => {
                    logger.info("Server Stopped Successfully");
                    process.exit(0);
                });
        });
    };
}

export function getResponse(
    message: string | null = null,
    data: RowRecord | object = {}
) {

    return {
        message: message,
        data: data
    }
}

export function toJSON(instance: Document){
    return instance.toJSON();
}

export function throwError(err: any){
    if (err) throw err;
}

export const accessPath = (path: string, object: Record<string, any>): any => {
    return path.split('.')
        .reduce((o: Record<string, any>, i: string) => o[i], object);
}
