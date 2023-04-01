import { gracefulShutdown, IContext, logger, setUpApp } from "./utils";

import { connectDB } from "./db";
import { connectCache } from "./cache";
import { IUser } from "./model";

declare module 'express-serve-static-core' {
    interface Request {
        context?: IContext
    }
}

declare module 'express-session' {
    export interface SessionData {
        user: IUser;
    }
}


const app = setUpApp();

const port = process.env.PORT || 5000;

async function start() {
    await connectDB(process.env.DB_URL!);
    await connectCache();

    const server = app.listen(port, () => {
        logger.info(`🚀 Server ready at ${process.env.BASE_URL}:${port} ...`);
    });

    process.on("SIGINT", gracefulShutdown(server));
    process.on("SIGTERM", gracefulShutdown(server));
}

start();
