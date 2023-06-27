import * as UserService from "../services/userService.js";
import {Configuration, SDK} from '@corbado/node-sdk';
import bcrypt from "bcryptjs";

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
const corbado = new SDK(config);

async function getUserStatus(username) {
  const user = await UserService.findByEmail(username);
  if (!user || user.password === null) {
    return "not_exists";
  } else {
    return "exists";
  }
}

async function verifyPassword(username, password) {
  try {
    const user = await UserService.findByEmail(username);
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const webhook = async (req, res) => {
  try {
    // Get the webhook action and act accordingly. Every CorbadoSDK
    // webhook has an action.
    let request;
    let response;

    switch (corbado.webhooks.getAction(req)) {
      // Handle the "authMethods" action which basically checks
      // if a user exists on your side/in your database.
      case corbado.webhooks.WEBHOOK_ACTION.AUTH_METHODS: {
        request = corbado.webhooks.getAuthMethodsRequest(req);
        // Now check if the given user/username exists in your
        // database and send status. Implement getUserStatus()
        // function below.
        const status = await getUserStatus(request.data.username);
        response = corbado.webhooks.getAuthMethodsResponse(status);
        res.json(response);
        break;
      }

      // Handle the "passwordVerify" action which basically checks
      // if the given username and password are valid.
      case corbado.webhooks.WEBHOOK_ACTION.PASSWORD_VERIFY: {
        request = corbado.webhooks.getPasswordVerifyRequest(req);

        // Now check if the given username and password is
        // valid. Implement verifyPassword() function below.
        const isValid = await verifyPassword(
          request.data.username,
          request.data.password
        );
        response = corbado.webhooks.getPasswordVerifyResponse(isValid);
        res.json(response);
        break;
      }
      default: {
        return res.status(400).send("Bad Request");
      }
    }
  } catch (error) {
    // We expose the full error message here. Usually you would
    // not do this (security!) but in this case CorbadoSDK is the
    // only consumer of your webhook. The error message gets
    // logged at CorbadoSDK and helps you and us debugging your
    // webhook.
    console.log(error);

    // If something went wrong just return HTTP status
    // code 500. For successful requests CorbadoSDK always
    // expects HTTP status code 200. Everything else
    // will be treated as error.
    return res.status(500).send(error.message);
  }
};
