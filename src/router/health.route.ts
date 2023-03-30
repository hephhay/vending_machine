import { Express } from "express";

import { HTTPStatusCodes } from "../utils";

function healthCheck(app: Express) {
    app.get('/health', async (req, res) => {
        res.status(HTTPStatusCodes.OK)
            .send({message: 'success'});
    });
}

export {
    healthCheck
}