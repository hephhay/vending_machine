import { Request, Router } from "express";

import { getManyProduct, getOneProduct } from "../controller";
import { IsAuthenticated, IsBuyer, IsOwner } from "../middleware";
import {
    HTTP_METHODS,
    productFilter,
    getResponse,
    HTTPStatusCodes
} from "../utils";

const productRouter = Router();

async function getProuctInstance(req: Request) {

    return {
        product: await getOneProduct(req),
        select: "product"
    };
}

productRouter.use(
    IsAuthenticated(),
    IsOwner("user.id", getProuctInstance, [HTTP_METHODS.POST], ["/user/"]),
    IsBuyer
);

productRouter.get("/", async (req, res) => {

    const filterParams = productFilter.parse(req.query);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "userfound",
                await getManyProduct(filterParams)
            )
        );
});

productRouter.get("/:id", async (req, res) => {

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "userfound",
                req.context?.product
            )
        );
});
