import cors from 'cors';
import { config } from 'dotenv';
import express from "express";
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { CustomRedisStore, redisClient } from '../cache';

import { notFound } from '../middleware';
import { createLogin, createLogout, createLogoutAl, healthCheck } from '../router';
import { appName, sessionTime } from './constants';


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
            prefix: `${appName}_`
        })
    }
    ));
    
    healthCheck(app);
    createLogin(app);
    createLogout(app);
    createLogoutAl(app);
    
    app.use(notFound);
    return app
}

export const DEBUG = process.env.NODE_ENV !== 'production';
