import { Express } from 'express';
import { v4 as uuidv4 } from "uuid";

import { clearSession, loginController } from '../controller';
import { IsAuthenticated } from '../middleware';
import { HTTPStatusCodes, throwError, userLogin } from '../utils';

export function createLogin(app: Express){
    app.post('login',async (req, res) => {
        const result = await loginController(userLogin.parse(req.body));

        req.session.regenerate(err => {

            throwError(err);

            req.sessionID = `${uuidv4()}:${result.user.id!}`;
            req.session.user = result.user.toObject();

        });

        res.status(HTTPStatusCodes.OK)
            .send({message: result.message});
    })
}

export function createLogout(app: Express){
    app.get('logout', IsAuthenticated(), async (req, res) => {

    req.session.destroy(err => {
        throwError(err);
        res.status(HTTPStatusCodes.OK)
            .send({message: "Logout Successfull"});
    });

    });
}

export function createLogoutAl(app: Express){
    app.get('logout/all', IsAuthenticated(), async (req, res) => {
        const number = await clearSession(req.session.user!, req.sessionID);

        res.status(HTTPStatusCodes.OK)
            .send({message: `${number} active session /s terminated`});
    })
}


export * from './health.route';