import { Request } from "express";
import { z } from "zod";
import { IProduct } from "../model";
import {
    createProduct,
    deleteProduct,
    findOneProduct,
    findProduct,
    updateProduct
} from "../services";

import {
    param,
    productFilter,
    productInput,
    productInputPartial,
    regexICase,
    TProductFilter
} from "../utils";

export async function createProductCtr(
    productInputData: z.infer<typeof productInput>
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

    const reqParams = param.parse(req.params);
    
    return findOneProduct(reqParams.id);
}

export async function getManyProduct(
    params: z.infer<typeof productFilter>
) {

    const filter: TProductFilter = {
        amountAvailable: {},
        cost: {},
    };

    if (params.productID) filter._id = regexICase(params.productID);
    if (params.sellerID) filter.sellerID = regexICase(params.sellerID);
    if (params.productName) filter.sellerID = regexICase(params.productName);
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