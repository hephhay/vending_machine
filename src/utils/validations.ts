import { z } from "zod";
import { Roles } from "./constants";

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
});

export const Param = z.object({
    id: z.string()
});