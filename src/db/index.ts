import { connect, disconnect, connection } from "mongoose";
import { logger } from "../utils";

async function connectDB (url: string) {
    try{
        await connect(url);
        logger.info("Connected to MongoDB");
    } catch (err) {
        logger.error(`Cannot connect to MongoDB`);
        throw err;
    }
};

connection.on(
    'error',
    err => {
        logger.error(`MongoDB Connection error ${err}`);
    }
)

async function disconnectDB() {
    await disconnect();
    logger.info("MongoDB Disconnected");
}

export { connectDB, disconnectDB };
