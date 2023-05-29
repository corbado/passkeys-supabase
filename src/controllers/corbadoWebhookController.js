const UserService = require("../services/userService");
const { Webhook } = require("corbado-webhook");
const bcrypt = require("bcryptjs");
const webhook = new Webhook();

async function getUserStatus(username) {
  const user = await UserService.findByEmail(username);
  if (!user) {
    return "not_exists";
  } else {
    if (user.password === null) {
      return "not_exists";
    }
    return "exists";
  }
}

async function verifyPassword(username, password) {
  try {
    const user = await UserService.findByEmail(username);
    if (!user) {
      return false;
    }
    const match = await bcrypt.compare(password, user.password);
    return match;
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.webhook = async (req, res) => {
  try {
    // Get the webhook action and act accordingly. Every Corbado
    // webhook has an action.
    let request;
    let response;

    switch (webhook.getAction(req)) {
      // Handle the "authMethods" action which basically checks
      // if a user exists on your side/in your database.
      case webhook.WEBHOOK_ACTION.AUTH_METHODS: {
        request = webhook.getAuthMethodsRequest(req);
        // Now check if the given user/username exists in your
        // database and send status. Implement getUserStatus()
        // function below.
        const status = await getUserStatus(request.data.username);
        response = webhook.getAuthMethodsResponse(status);
        res.json(response);
        break;
      }

      // Handle the "passwordVerify" action which basically checks
      // if the given username and password are valid.
      case webhook.WEBHOOK_ACTION.PASSWORD_VERIFY: {
        request = webhook.getPasswordVerifyRequest(req);

        // Now check if the given username and password is
        // valid. Implement verifyPassword() function below.
        const isValid = await verifyPassword(
          request.data.username,
          request.data.password
        );
        response = webhook.getPasswordVerifyResponse(isValid);
        res.json(response);
        break;
      }
      default: {
        return res.status(400).send("Bad Request");
      }
    }
  } catch (error) {
    // We expose the full error message here. Usually you would
    // not do this (security!) but in this case Corbado is the
    // only consumer of your webhook. The error message gets
    // logged at Corbado and helps you and us debugging your
    // webhook.
    console.log(error);

    // If something went wrong just return HTTP status
    // code 500. For successful requests Corbado always
    // expects HTTP status code 200. Everything else
    // will be treated as error.
    return res.status(500).send(error.message);
  }
};
