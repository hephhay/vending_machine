import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { logger } from "./utils";
import { connectDB, disconnectDB } from "./db";
import { cacheClient, disconnectClient } from "./cache";
import { notFound } from "./middleware";
import { Server } from "http";

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(notFound);

const port = process.env?.PORT || 5000;

async function start() {
    await connectDB(process.env.DB_URL || "");
    await cacheClient(process.env.CACHE_URL);

    const server = app.listen(port, () => {
        logger.info(`🚀 Server ready at http://127.0.0.1:${port} ...`);
    });

    process.on("SIGINT", gracefulShutdown(server));
    process.on("SIGTERM", gracefulShutdown(server));
}

function gracefulShutdown(server: Server) {
    return (signal: any) => {
        logger.info(`Recieved signal ${signal}`);
        logger.info("Gracefully Shutting down server");
        server.close(() => {
            disconnectClient()
                .then(() => disconnectDB())
                .then(() => {
                    logger.info("Server Stopped Successfully");
                    process.exit(0);
                });
        });
    };
}

start();
