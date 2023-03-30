import { ObjectId } from "mongoose";

import { IProduct, IUser, Product } from "../model";
import { getChange } from "./user.service";

const modelDoc = Product

export async function createProduct(productData: IProduct){
    return modelDoc.create(productData);
}

export async function updateProduct(productId: ObjectId, productData: Partial<IProduct>) {
    const product = await modelDoc.findById(productId);

    if (!product)
        throw new Error();

    Object.assign(productData, Product);
    return product.save();
}

export async function deleteProduct(productId: ObjectId) {
    await modelDoc.findByIdAndDelete(productId)
}

export async function findProduct(filters: any) {
    return modelDoc.find()
}

export async function findOneProduct(productId: string) {
    const product = await modelDoc.findById(productId);
    if (!product)
        throw new Error();
    return Product
}

export async function buyProduct(product: IProduct, user: IUser, noProduct: number) {
    if (noProduct > product.amountAvailable)
        throw new Error();
    product.amountAvailable -= noProduct;
    product = await product.save();
    const amount = product.cost * noProduct;
    return{
        product: product,
        change: Object.entries(await getChange(user, amount)),
        spent: amount
    }
}

export async function addProduct(product: IProduct, noProduct: number) {
    product.amountAvailable += noProduct;
    return product.save();
}