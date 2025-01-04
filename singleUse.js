const express = require('express');
const validUrl = require('valid-url');
const { redisClient } = require('./redis');
const { getNanoId } = require('./utils');

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: 'URL is required in request body'
            });
        }

        const isValid = validUrl.isUri(url) ? true : false;

        if (!isValid) {
            return res.status(400).json({
                error: 'URL provided is not valid'
            });
        }

        const urlId = await getNanoId()
        const redisAdd = await redisClient.set(urlId, url, { EX: 3600 })
        if (redisAdd === 'OK') {
            return res.json({
                singleUseUrl: `${process.env.SINGLE_USE_BASE_URL}${urlId}`
            });
        } else {
            return res.status(500).json({
                error: 'Unable to save url'
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

router.get('/:urlId', async (req, res) => {
    try {
        const { urlId } = req.params;

        if (!urlId) {
            return res.status(400).json({
                error: 'urlId is required'
            });
        }

        const cachedResult = await redisClient.get(urlId);

        if (!cachedResult) {
            return res.status(400).json({
                error: 'Url is invalid'
            });
        }

        if (cachedResult) {
            await redisClient.del([urlId])
            return res.redirect(cachedResult)
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router