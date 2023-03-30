import RedisStore from "connect-redis";
import { SessionData } from "express-session";
import { NormalizedRedisClient, RedisStoreOptions } from "../utils";

const noop = (_err?: unknown, _data?: any) => {}

class CustomRedisStore extends RedisStore{
    client: NormalizedRedisClient;

    constructor(opts: RedisStoreOptions) {
        super(opts);
        this.client = this.includeSAdd(opts.client);
    }

    private includeSAdd(client: any): NormalizedRedisClient{
        const isRedis = "scanIterator" in client;
        return{
            ...super.client,
            sAdd: (key, member) => {
                //node-redis impl.
                if (isRedis) return client.sAdd(key, member);
                // ioredis impl.
                return client.sadd(key, member);
            }
        }
    }

    override async set(sid: string, sess: SessionData, cb = noop){
        const setSession = await super.set(sid, sess, cb);
        const [prefix, _, userID] = sid.split(':');

        try{
            await this.client.sAdd(`${prefix}:${userID}`, sid);
            return setSession;
        } catch (err){
            return cb(err);
        }
    }
}

export { CustomRedisStore }
