import { createClient } from "redis";

import { logger, sesPrefix } from "../utils";

const redisClient = createClient({
    url: process.env.CACHE_URL
});

const redisClientSub = redisClient.duplicate();

redisClient.on(
    "error",
    err => logger.error(`Redis Client Error ${err}`)
);

async function connectCache() {
    await redisClient.connect();
    logger.debug("Connected to Redis");

    redisClient.configSet('notify-keyspace-events', 'Kg');
    logger.debug("Key Event Configuration Set");

    await connectSub()

}

async function connectSub() {
    await redisClientSub.connect();
    logger.debug("Connected to Subscribtion Client")

    await redisClientSub.pSubscribe(
        [
            "__keyevent@0__:del",
            "__keyevent@0__:expired",
            `__keyspace@0__:${sesPrefix}*:*`
        ],
        (_: string, channel: string) => {

            const modifiedEvent = channel.replace(/^__keyspace@0__:/, '');

            handleEvent(modifiedEvent)
                .then(() => {
                    logger.debug(`Success ` +
                        `${modifiedEvent} removed from user sessions`);
                }).catch((err) => {
                    logger.error(err);
                });
        }
    );

    logger.debug(`Subscribed to channels`);
}

async function disconnectCache(client: typeof redisClient, clientSub: typeof redisClient) {
    await clientSub.pUnsubscribe();
    logger.debug("Unsubscribed from channels")

    await clientSub.disconnect();
    logger.debug("Keyevent Subscribtion disconnected");

    logger.debug("Unsubscribing from all events")
    await redisClient.flushAll();
    logger.debug('sesion cache flushed');
    await client.disconnect();
    logger.debug("Redis Disconnected");
}

const handleEvent = async (event_key: string) => {
    const parts = event_key.match(/^(.*):(.*):(.*)$/)
    const sessionStore = `${parts![1]}:${parts![2]}`
    await redisClient.sRem(sessionStore, event_key)
}

export { redisClient, redisClientSub, connectCache, disconnectCache };
export * from "./store";
