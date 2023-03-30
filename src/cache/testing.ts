import { createClient, defineScript } from 'redis';

export async function help(){
const client = createClient({
  scripts: {
    add: defineScript({
      NUMBER_OF_KEYS: 1,
      SCRIPT:
        'return redis.call("GET", KEYS[1]) + ARGV[1];',
      transformArguments(key: string, toAdd: number): Array<string> {
        return [key, toAdd.toString()];
      },
      transformReply(reply: number): number {
        return reply;
      }
    })
  }
});

await client.connect();

await client.set('key', '1');
await client.add('key', 2); // 3
}