import { Express } from "express";

import { buyCtr, clearSession, loginController } from "../controller";
import { IsAuthenticated, IsBuyer, IsOwner } from "../middleware";
import { depositCoin, resetDeposit } from "../services";
import {
    buyInput,
    depositParam,
    getResponse,
    HTTPStatusCodes,
    regenSession,
    throwError,
    userLogin
} from "../utils";
import { getUserInstance } from "./users.route";

export function createLogin(app: Express) {

    app.post("/login", async (req, res) => {

        const result = await loginController(userLogin.parse(req.body), req);

        regenSession(result.user, req);

        res.status(HTTPStatusCodes.OK)
            .send(
                getResponse(
                    result.message,
                    {user: result.user}
                )
            );
    })
}

export function createLogout(app: Express) {

    app.get("/logout", IsAuthenticated(), async (req, res) => {

    req.session.destroy(err => {

        throwError(err);
    });

    res.status(HTTPStatusCodes.OK)
        .send(getResponse("Logout Successfull"));

    });
}

export function createLogoutAl(app: Express) {

    app.get("/logout/all", IsAuthenticated(), async (req, res) => {

        const number = await clearSession(req.session.user!, req.sessionID);

        res.status(HTTPStatusCodes.OK)
            .send(getResponse(`${number} active session /s terminated`));
    })
}

export function depositEndpoint(app: Express){

    const middleware = [
        IsAuthenticated(),
        IsOwner("id", getUserInstance),
        IsBuyer
    ];

    app.post("/deposit", ...middleware, async (req, res) => {

        const deposit = depositParam.parse(req.body);

        res.status(HTTPStatusCodes.OK)
            .send(
                getResponse(
                    "amount deposited successfully",
                    await depositCoin(req.context!.user!, deposit.amount)
                )
            );
    });
}

export function buyEndpoint(app: Express){

    const middleware = [
        IsAuthenticated(),
        IsBuyer
    ];

    app.post("/buy", ...middleware, async (req, res) => {

        const buyInputData = buyInput.parse(req.body);

        res.status(HTTPStatusCodes.OK)
            .send(getResponse(
                "product bought",
                await buyCtr(
                    buyInputData.productID,
                    req.session.user!.id!,
                    buyInputData.quantity
                )
            ));
    });
}

export function resetEndpoint(app: Express){
    //TODO: 
    const middleware = [
        IsAuthenticated(),
        IsOwner("id", getUserInstance),
        IsBuyer
    ];

    app.get("/reset", ...middleware, async (req, res) => {

        res.status(HTTPStatusCodes.OK)
            .send(getResponse(
                "deposit reset",
                await resetDeposit(req.context!.user!)
            ));
    });

}

export * from "./users.route";
export * from "./product.route";
export * from "./health.route";