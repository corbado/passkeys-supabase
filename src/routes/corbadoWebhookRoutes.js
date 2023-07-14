import express from 'express';
import { webhook as webhookController } from '../controllers/corbadoWebhookController.js';
import {SDK, Configuration} from '@corbado/node-sdk';
import dotenv from 'dotenv';

dotenv.config();

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
config.webhookUsername = process.env.WEBHOOK_USERNAME;
config.webhookPassword = process.env.WEBHOOK_PASSWORD;
const corbado = new SDK(config);

const router = express.Router();

router.post('/corbado-webhook', corbado.webhooks.middleware, webhookController);

export default router;
