import {
    Schema,
    model,
    Document,
    Types,
    HydratedDocument,
    Model
} from "mongoose";
import { costMultiple, isMultiple, isPositive } from "../utils";
import { IUser, IUserProp } from "./user.model";

interface IProduct extends Document{
    productName: string,
    amountAvailable: number,
    cost: number,
    sellerID: Types.ObjectId
}

interface IProductProps{
    seller: HydratedDocument<IUser, IUserProp>;
}

type ProductModel = Model<IProduct, {}, IProductProps>;

const ProductSchema = new Schema<IProduct, ProductModel, IProductProps>(
    {
        productName: {
            type: String,
            required: [true, "ProductName is required"],
            trim: true,
        },
        amountAvailable: {
            type: Number,
            default: 0,
            validate:{
                validator: isPositive,
                message: "Amount Available should be a positive number"
            }
        },
        cost: {
            type: Number,
            default: 0,
            validate: {
                validator: function (val: number){
                    return isPositive(val) && isMultiple(val, costMultiple);
                },
                message: `Cost should be positive
                            and a multiple of ${costMultiple}`
            }
        },
        sellerID: {
            type: Schema.Types.ObjectId,
            ref: "User"
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

ProductSchema.virtual<IProduct>(
    "seller",
    {
        ref: "User",
        localField: "sellerID",
        foreignField: "_id",
        justOne: true
    }
);

ProductSchema.pre<IProduct>(
    "find",
    function(){
        this.populate('user');
    }
);

const Product = model<IProduct, ProductModel>("Product", ProductSchema);

export { Product, IProduct }
