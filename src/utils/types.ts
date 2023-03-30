import { Request } from "express";
import { SessionData } from "express-session";
import { FilterQuery } from "mongoose";
import { IProduct, IUser, User } from "../model";
import { HTTP_METHODS } from "./constants";

export type AllowedCoins = '5' | '10' | '20' | '50' | '100';

export interface Coins {
    [denomination: number]: number;
}

export interface NormalizedRedisClient {
    get(key: string): Promise<string | null>
    set(key: string, value: string, ttl?: number): Promise<string | null>
    expire(key: string, ttl: number): Promise<number | boolean>
    scanIterator(match: string, count: number): AsyncIterable<string>
    del(key: string[]): Promise<number>
    mget(key: string[]): Promise<(string | null)[]>
    sAdd: (key: string, member: string[] | string) => Promise<number>
}

export interface RedisStoreOptions {
    client: any
    prefix?: string
    scanCount?: number
    serializer?: Serializer
    ttl?: number
    disableTTL?: boolean
    disableTouch?: boolean
}

export interface Serializer {
    parse(s: string): SessionData
    stringify(s: SessionData): string
}

export interface IContext{
    user?: IUser,
    product?: IProduct
    select: SelectType  | string
}

export type SelectType = "user" | "product";

export type TUserFilter = FilterQuery<typeof User>

export type RowRecord = { [K in string]: CellData };

export type CellData = string | number | null | boolean | RowRecord;

export interface MiddlewareOpt{
    excludeMethod: HTTP_METHODS[],
    excludePath: string[],
    excludeCal: (req: Request) => boolean
}
