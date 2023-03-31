import { Request } from "express";
import { z } from "zod";
import { IProduct } from "../model";
import {
    buyProduct,
    createProduct,
    deleteProduct,
    findOneProduct,
    findOneUser,
    findProduct,
    updateProduct
} from "../services";

import {
    extractObjectIdsFromPath,
    param,
    productFilter,
    productInputPartial,
    regexICase,
    TProductFilter,
    userProduct
} from "../utils";

export async function createProductCtr(
    productInputData: z.infer<typeof userProduct>
) {

    return createProduct(productInputData);
}

export async function updateProductCtr(
    productContext: IProduct,
    productInputData: z.infer<typeof productInputPartial>
) {

    return updateProduct(productContext, productInputData);
}

export async function deleteProductCtr(productContext: IProduct) {

    return deleteProduct(productContext);
}

export async function getOneProduct(req: Request) {

    const [id, ..._] = extractObjectIdsFromPath(req);
    
    return findOneProduct(id);
}

export async function getManyProduct(
    params: z.infer<typeof productFilter>
) {

    const filter: TProductFilter = {
        amountAvailable: {},
        cost: {},
    };

    if (params.productID) filter._id = params.productID;
    if (params.sellerID) filter.sellerID = params.sellerID;
    if (params.productName) filter.productName = regexICase(params.productName);
    if (params.amountAvailable)
        filter.amountAvailable.$eq = params.amountAvailable;
    if (params.amountAvailable_lte)
        filter.amountAvailable.$lte = params.amountAvailable_lte;
    if (params.amountAvailable_gte)
        filter.amountAvailable.$gte = params.amountAvailable_gte;
    if (params.cost)
        filter.cost.$eq = params.cost;
    if (params.cost_lte)
        filter.cost.$lte = params.cost_lte;
    if (params.cost_gte)
        filter.cost.$gte = params.cost_gte;

    return findProduct(filter);
}

export async function buyCtr(
    productID: string,
    userID: string,
    noProd: number
) {

    const user = await findOneUser(userID);
    const product = await findOneProduct(productID);

    return buyProduct(product, user, noProd);
}