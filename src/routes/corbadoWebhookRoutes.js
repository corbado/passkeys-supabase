const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/corbadoWebhookController');
const {webhookMiddleware} = require("corbado-webhook");
require('dotenv').config();

router.post('/corbado-webhook', webhookMiddleware(process.env.WEBHOOK_USERNAME, process.env.WEBHOOK_PASSWORD), webhookController.webhook);

module.exports = router;
