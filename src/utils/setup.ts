import "express-async-errors";
import cors from 'cors';
import { config } from 'dotenv';
import express from "express";
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { CustomRedisStore, redisClient } from '../cache';

import { handleError, notFound } from '../middleware';
import {
    buyEndpoint,
    createLogin,
    createLogout,
    createLogoutAl,
    depositEndpoint,
    healthCheck,
    productRouter,
    resetEndpoint,
    userRouter
} from '../router';
import { appName, sesPrefix, sessionTime } from './constants';
import mongoose from "mongoose";


config({
    path: '.env'
});

export function setUpApp(){
    const app = express();
    app.use(morgan("tiny"));
    app.use(express.json());
    app.set("trust proxy", 1);
    
    app.use(helmet());
    app.use(cors());
    
    app.use(express.json());
    
    app.use(session({
        name: appName,
        secret: process.env.SECRET_KEY!,
        rolling: true,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: !DEBUG,
            maxAge: sessionTime
        },
        store: new CustomRedisStore({
            client: redisClient,
            prefix: sesPrefix
        })
    }));
    
    healthCheck(app);
    createLogin(app);
    createLogout(app);
    createLogoutAl(app);
    depositEndpoint(app);
    buyEndpoint(app);
    resetEndpoint(app);

    app.use("/product", productRouter);
    app.use("/user", userRouter);

    app.use(notFound);
    app.use(handleError);
    return app
}

export const DEBUG = process.env.NODE_ENV !== 'production';

mongoose.set('debug', DEBUG);
