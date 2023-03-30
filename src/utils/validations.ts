import { z } from "zod";

import { costMultiple, Roles } from "./constants";

export const userLogin = z.object({
    username: z.string(),
    password: z.string(),
});

export const userInput = userLogin.extend({
    role: z.enum([Roles.BUYER, Roles.SELLER])
});

export const userInputPartial = userInput.partial();

export const userFilter = userInputPartial.omit({
    password: true
}).extend({
    userID: z.string().optional()
});

export const integer = z.number().int().nonnegative().safe();

const optinalInteger = integer.optional();

export const amountAllowed = integer.multipleOf(costMultiple);

export const productInput = z.object({
    productName: z.string(),
    amountAvailable: amountAllowed,
    cost: integer
});

export const productInputPartial = productInput.partial();

export const productFilter = productInputPartial.extend({
    amountAvailable_gte: optinalInteger,
    amountAvailable_lte: optinalInteger,
    cost_gte: optinalInteger,
    cost_lte: optinalInteger,
    sellerID: z.string().optional(),
    productID: z.string().optional()
});

export const param = z.object({
    id: z.string()
});