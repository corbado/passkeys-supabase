const express = require("express");
const ejs = require("ejs");
const authRoutes = require("./src/routes/authRoutes");
const webhookRoutes = require("./src/routes/corbadoWebhookRoutes");
const UserService = require("./src/services/userService");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

async function addTestUsers() {
  try {
    // Define test users with their email addresses and plaintext passwords
    const testUsers = [
      { name: "demo_user", email: "demo_user@company.com", password: "demo12" },
      { name: "max", email: "max@company.com", password: "maxPW" },
      { name: "jon", email: "john@company.com", password: "123456" },
    ];

    const saltRounds = 10;

    // Iterate through the test users and add them to the database
    for (const testUser of testUsers) {
      const user = await UserService.findByEmail(testUser.email);
      if (user) {
        console.log(`Test user ${testUser.email} already exists, skipping.`);
        continue;
      }

      await UserService.create(
        testUser.name,
        testUser.email,
        testUser.password
      );
      console.log(`Added test user: ${testUser.email}`);
    }
  } catch (error) {
    console.log("Error adding test users:", error);
  }
}

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

const db = require("./models");

function syncDBWithRetry(attemptsLeft) {
  db.sequelize
    .sync()
    .then(() => {
      console.log("Synced db.");
      return addTestUsers();
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);

      if (attemptsLeft > 0) {
        console.log(`Retrying in 2 seconds... Attempts left: ${attemptsLeft}`);
        setTimeout(() => syncDBWithRetry(attemptsLeft - 1), 2000);
      } else {
        console.log("Failed to sync db after multiple attempts.");
      }
    });
}

syncDBWithRetry(5); // Retry up to 5 times with 2-second intervals

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", authRoutes);
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
