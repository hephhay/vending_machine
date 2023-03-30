import { z } from "zod";

import { redisClient } from "../cache";
import { IUser } from "../model";
import {
    createUser,
    findOneUser,
    updateUser,
    deleteUser,
    findUser
} from "../services";
import {
    removeItem,
    sesPrefix,
    userLogin,
    userInput,
    userInputPartial,
    userFilter,
    TUserFilter,
    regexICase
} from "../utils";

export async function loginController(userLoginData: z.infer<typeof userLogin>) {
    const user = await findOneUser(userLoginData.username);

    if (await user.validatePassword(userLoginData.password)){

        const cardinal = await redisClient.SCARD(sesPrefix + user.id!)

        return{
            user: user,
            message: cardinal > 1 ?
                "There is already an active session using your account" :
                "Logged in successfully"
        }

    }

    throw new Error("Invalid Username and password");
}

export async function clearSession(
    user: IUser,
    currentSess: string,
    all = false
) {

    const sesStrore = sesPrefix + user.id!;
    const curSess = sesPrefix + currentSess; 
    const sesKeys = await redisClient.SMEMBERS(sesStrore);

    const remKeys = all ? sesKeys : removeItem(sesKeys, curSess);

    await redisClient.del([sesStrore, ...remKeys]);

    return remKeys.length -1;
}

export async function createUserCtr(userDataInput: z.infer<typeof userInput>) {

    return createUser(userDataInput);
}

export async function updateUserCtr(
    userContext: IUser,
    userDataInput: z.infer<typeof userInputPartial>,
    currentSess: string
) {

    const user = updateUser(userContext, userDataInput);
    await clearSession(userContext, currentSess);
    return user;
}

export async function deleteUserCtr(
    userContext:IUser,
    currentSess: string
) {

    await deleteUser(userContext);
    await clearSession(userContext, currentSess);
}

export async function getOneUser(userID: string) {

    return findOneUser(userID);
}

export async function getManyUser(params: z.infer<typeof userFilter>) {

    const filter: TUserFilter  = {};

    if (params.userID) filter._id = regexICase(params.userID)
    if (params.username) filter.username = regexICase(params.username);
    if (params.role) filter.role = params.role;

    return findUser(filter);

}