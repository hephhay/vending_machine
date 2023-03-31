import { prefixVal } from "./helpers";

export enum HTTPStatusCodes {
    INTERNAL_SERVER_ERROR = 500,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    OK = 200,
    CREATED = 201,
}

export enum Roles{
    BUYER = "buyer",
    SELLER = "seller"
}

export enum HTTP_METHODS{
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD"
}

export const HTTP_SAFE_METHODS = [
    HTTP_METHODS.HEAD,
    HTTP_METHODS.GET,
    HTTP_METHODS.OPTIONS
]

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*]).{8,}$/;

export const costMultiple = 5;

export const sessionTime = 5 * 60 * 1000;

export const appName = 'vending_machine';

export const sesPrefix = prefixVal("");

export const sessAliasKey =
    (key: string) =>  prefixVal(`alias:${key}`);
