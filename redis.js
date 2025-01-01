const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT
    }
});

module.exports = {
    redisClient
}