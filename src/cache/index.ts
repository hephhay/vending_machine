import { createClient, RedisClientType } from 'redis';

import { logger } from '../utils';

let client: RedisClientType;

async function cacheClient(cache_url?: string) {
    client = createClient({
        url: cache_url
    });
    client.on(
        'error',
        err => logger.error(`Redis Client Error ${err}`)
    );
    await client.connect();
    logger.info("Connected to Redis");
}

async function disconnectClient() {
    await client.disconnect();
}

export { cacheClient, disconnectClient, client }