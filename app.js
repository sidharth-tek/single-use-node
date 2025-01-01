const express = require('express');
require('dotenv').config();

const singleUseRoutes = require('./singleUse');
const { redisClient } = require('./redis');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());
// Connect to Redis
(async () => {
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
})();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/single-use', singleUseRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});