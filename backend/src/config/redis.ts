import {createClient} from 'redis';
    //redis connection setup

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const redisClient = createClient({
  url: REDIS_URL
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  console.log("Redis connected");
}

export { redisClient  };