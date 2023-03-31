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

const optionalInteger = integer.optional();

const optionalIntegerString = z.string().transform(Number);

export const amountAllowed = integer.multipleOf(costMultiple);

export const productInput = z.object({
    productName: z.string(),
    amountAvailable: optionalInteger,
    cost: amountAllowed,
});

export const userProduct = productInput.extend({
    sellerID: z.string()
});

export const productInputPartial = productInput.partial();

export const productFilter = z.object({
    amountAvailable_gte: optionalIntegerString,
    amountAvailable_lte: optionalIntegerString,
    amountAvailable: optionalIntegerString,
    cost_gte: optionalIntegerString,
    cost_lte: optionalIntegerString,
    cost: optionalIntegerString,
    sellerID: z.string().optional(),
    productID: z.string().optional(),
    productName: z.string().optional()
});

export const param = z.object({
    id: z.string()
});

export const depositParam = z.object({
    amount: z.enum(['5', '10', '20', '50', '100'])
});

export const buyInput = z.object({
    productID: z.string(),
    quantity: integer
});

export const addProductInput = buyInput.omit({
    productID: true
});
