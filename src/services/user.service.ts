import { z } from "zod";
import { Types } from "mongoose";

import { NotFound } from "../errors";
import { IUser, User } from "../model";
import {
    AllowedCoins,
    Coins,
    userInput,
    userInputPartial,
    TUserFilter
} from "../utils";

const modelDoc: typeof User = User

export async function createUser(userData: z.infer<typeof userInput>) {

    return modelDoc.create(userData);
}

export async function updateUser(
    userContext: IUser,
    userData: z.infer<typeof userInputPartial>
) {

    Object.assign(userContext, userData);
    return userContext.save();
}

export async function deleteUser(userContext: IUser) {

    await userContext.deleteOne();
}

export async function findUser(filters: TUserFilter) {

    return modelDoc.find(filters);
}

export async function findOneUser(userId: string) {

    const filter:  TUserFilter = {};

    if (Types.ObjectId.isValid(userId)) filter._id = userId;
    else filter.username = userId;

    const user = await modelDoc.findOne(filter);

    if (!user)
        throw new NotFound("User not Found");

    return user
}

export async function depositCoin(user: IUser, coin: AllowedCoins) {

    const value =  user.deposit.get(coin) + 1
    user.deposit.set(coin, value);
    return user.save();
}

export async function resetDeposit(user: IUser) {

    user.set("deposit", {});
    return user.save();
}

export async function getChange(user :IUser, amount: number) {

    const coins: Coins = user.deposit.toObject();
    const denominations = Object.keys(coins).map(val => Number(val)).
                            sort((a, b) => b - a);

    const change: Coins = {};

    for (let i = 0; i < denominations.length; i++) {

        const denomination = denominations[i];
        const coinCount = Math.floor(amount / denomination);
    
        if (coins[denomination] >= coinCount) {

            coins[denomination] -= coinCount;
            amount -= denomination * coinCount;
    
            if (coinCount > 0) {

            change[denomination] = coinCount;
            }
        }
    }
    await resetDeposit(user);
    return coins;
}
