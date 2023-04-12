import { Request, Router } from "express";

import {
    createProductCtr,
    deleteProductCtr,
    getManyProduct,
    getOneProduct,
    updateProductCtr
} from "../controller";
import { IsAuthenticated, IsOwner, IsSeller } from "../middleware";
import { addProduct } from "../services";
import {
    productFilter,
    getResponse,
    HTTPStatusCodes,
    productInputPartial,
    productInput,
    addProductInput,
    HTTP_METHODS
} from "../utils";

const productRouter = Router();

async function getProductInstance(req: Request) {

    return {
        product: await getOneProduct(req),
        select: "product"
    };
}

productRouter.use(
    IsAuthenticated([HTTP_METHODS.GET]),
    IsOwner("seller.id", getProductInstance, [HTTP_METHODS.GET], ["/", ""]),
    IsSeller,
);

productRouter.get("/", async (req, res) => {

    const filterParams = productFilter.parse(req.query);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "products found",
                await getManyProduct(filterParams)
            )
        );
});

productRouter.get("/:id", async (req, res) => {

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "product found",
                req.context?.product
            )
        );
});

productRouter.post("/", async (req, res) => {

    const productData = productInput.parse(req.body);

    const userProduct = {
        ...productData,
        sellerID: req.session.user!.id!
    };

    res.status(HTTPStatusCodes.CREATED)
        .send(
            getResponse(
                "Product created succesfully",
                await createProductCtr(userProduct)
            )
        );
})

productRouter.put("/:id", async (req, res) => {

    const productData = productInputPartial.parse(req.body);

    res.status(HTTPStatusCodes.OK)
    .send(
        getResponse(
            "product updated successfully",
            await updateProductCtr(req.context!.product!, productData)
        )
    );
});

productRouter.delete("/:id", async (req, res) => {

    await deleteProductCtr(req.context!.product!);

    res.status(HTTPStatusCodes.OK)
        .send(getResponse("product deleted successfully"));

});

productRouter.post("/:id/add", async (req, res) => {

    const productData = addProductInput.parse(req.body);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "added more quantity to product",
                await addProduct(req.context!.product!, productData.quantity)
            )
        );
});

export { productRouter };