import { Express } from "express";
import { IsAuthenticated } from "../middleware";

import { HTTPStatusCodes } from "../utils";

function healthCheck(app: Express) {
    app.get('/',async (req, res) => {

        res.redirect("/health");
    })

    app.get('/health', async (req, res) => {
        res.status(HTTPStatusCodes.OK)
            .send({message: 'success'});
    });
}

export {
    healthCheck
}