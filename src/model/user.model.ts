import { Schema, model, Model, Document, Types } from "mongoose";
import {compare, genSalt, hash} from "bcrypt";

import { isPositive, passwordRegex, Roles } from "../utils";

interface ICoins extends Document{
    '5': number,
    '10': number,
    '20': number,
    '50': number,
    '100': number,
}

const singleCoinSchema = {
    type: Number,
    default: 0,
    validate: isPositive
}

interface IUser extends Document{
    username: string,
    password: string,
    deposit: Types.Subdocument<ICoins>,
    role: Roles,
}

interface IUserProp{
    validatePassword(password: string): Promise<boolean>;
    balance: number;
}

type UserModel = Model<IUser, {}, IUserProp>;

const CoinSchema = new Schema(
    {
        '5': singleCoinSchema,
        '10': singleCoinSchema,
        '20': singleCoinSchema,
        '50': singleCoinSchema,
        '100': singleCoinSchema
    },{
        id: false
    }
);

const UserSchema = new Schema<IUser, UserModel, IUserProp>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true
        },
        password:{
            type: String,
            required: [true, "Password is required"]
        },
        deposit: {
            type: CoinSchema,
            default: () => ({})
        },
        role: {
            type: String,
            trim: true,
            default: Roles.BUYER,
            enum: Object.values(Roles)
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        versionKey: false
    }
);

UserSchema.method<IUser>(
    "validatePassword",
    async function validatePassword(password: string){
        return compare(password, this.password);
});

UserSchema.virtual<IUser>("balance").get(function(){
    return Object.entries(this.deposit.toJSON()).reduce(
        (acc, [key, value]) => (acc + (Number(key) * Number(value))),
        0
    );
});

UserSchema.pre(
    'save',
    async function(next) {
        // only hash the password if it has been modified (or is new)
        if (!this.isModified("password")) return next();

        // validate password
        if (passwordRegex.test(this.password)){
            const salt = await genSalt(Number(process.env.SALT_WORK_FACTOR));
            this.password = await hash(this.password, salt);
            return next();
        }
    }
);

const User = model<IUser, UserModel>("User", UserSchema);

export {User, IUser, IUserProp, ICoins }
