import express from "express";
import ejs from "ejs";
import authRoutes from "./src/routes/authRoutes.js";
import webhookRoutes from "./src/routes/corbadoWebhookRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", authRoutes);
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
