import { z } from "zod";

import { IProduct, IUser, Product } from "../model";
import { productInput, productInputPartial, TProductFilter } from "../utils";
import { getChange } from "./user.service";

const modelDoc = Product

export async function createProduct(productData: z.infer<typeof productInput>){
    return modelDoc.create(productData);
}

export async function updateProduct(
    productContext: IProduct,
    productData: z.infer<typeof productInputPartial>
) {

    Object.assign(productContext, productData);
    return productContext.save();
}

export async function deleteProduct(productContext: IProduct) {

    return productContext.deleteOne();
}

export async function findProduct(filters: TProductFilter) {
    return modelDoc.find(filters)
}

export async function findOneProduct(productId: string) {

    const product = await modelDoc.findById(productId);

    if (!product)
        throw new Error();

    return product
}

export async function buyProduct(
    productContext: IProduct,
    user: IUser,
    noProduct: number
) {

    if (noProduct > productContext.amountAvailable)
        throw new Error();

    productContext.amountAvailable -= noProduct;
    const product = await productContext.save();

    const amount = product.cost * noProduct;

    return{
        product: product,
        change: Object.entries(await getChange(user, amount)),
        spent: amount
    }
}

export async function addProduct(productContext: IProduct, noProduct: number) {

    productContext.amountAvailable += noProduct;

    return productContext.save();
}