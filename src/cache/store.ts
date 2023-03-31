import RedisStore from "connect-redis";
import { SessionData } from "express-session";
import { redisClient } from ".";
import {
    cleanKey,
    NormalizedRedisClient,
    prefixVal,
    RedisStoreOptions,
    sesPrefix,
    sessAliasKey
} from "../utils";

const noop = (_err?: unknown, _data?: any) => {}

class CustomRedisStore extends RedisStore {

    client: NormalizedRedisClient;
    opt: typeof redisClient;

    constructor(opts: RedisStoreOptions) {
        super(opts);
        this.client = this.includeSAdd(opts.client);
        this.opt = opts.client;
    }

    private includeSAdd(client: any): NormalizedRedisClient{
        const isRedis = "scanIterator" in client;
        return{
            ...this.client,
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

        try{

            await this.client.set(sessAliasKey(sid), sess.user.id);

            await this.client.sAdd(
                prefixVal(sess.user.id),
                prefixVal(sid)
            );
            return setSession;
        } catch (err){

            return cb(err);
        }
    }

    override async destroy(sid: string, cb = noop) {
        const delSession = await super.destroy(sid, noop); 

        try {
            await cleanKey(sid);
            return delSession
        } catch (err) {

            return cb(err)
        }
    }
}

export { CustomRedisStore }
