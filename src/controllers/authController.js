import * as UserService from "../services/userService.js";
import { SDK, Configuration } from "@corbado/node-sdk";
import * as TodoService from "../services/todoService.js";

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
config.frontendAPI = "https://pro-5530967235591612107.auth.corbado.com";
const corbado = new SDK(config);

export const home = (req, res) => {
  res.redirect("/login");
};

export const login = (req, res) => {
  res.render("pages/login");
};

export const profileOld = async (req, res) => {
  const { authenticated, email } = await corbado.session.getCurrentUser(req);

  if (!authenticated) {
    return res.redirect("/logout");
  }

  try {
    const userId = await UserService.findIdByEmail(email);
    const user = await UserService.findById(userId);
    console.log("FindById result: ", user);
    if (!user) {
      res.redirect("/logout");
    } else {
      res.render("pages/profile", {
        username: user.email,
        userFullName: user.user_metadata.name,
        supabaseID: user.id,
        corbadoID: user.user_metadata.corbadoId,
      });
    }
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send("Server Error");
  }
};

export const logout = (req, res) => {
  res.redirect("/");
};

export const profile = async (req, res) => {
  try {
    const { email, name } = await corbado.session.getCurrentUser(req);
    console.log("User email: ", email);
    console.log("Getting user by email: ", email);
    const userId = await UserService.findIdByEmail(email);
    if (!userId) {
      // Create new user
      console.log("Creating new user with email: ", email);
      UserService.create(email, name).then((u) => {
        const user = u.user;
        console.log("User created: ", user);
        res.render("pages/profile", {
          username: user.email,
          userFullName: user.user_metadata.name,
          supabaseID: user.id,
          corbadoID: user.user_metadata.corbadoId,
        });
      });
    } else {
      // User already exists
      console.log("User found: ", userId);
      const user = await UserService.findById(userId);
      res.render("pages/profile", {
        username: user.email,
        userFullName: user.user_metadata.name,
        supabaseID: user.id,
        corbadoID: user.user_metadata.corbadoId,
      });
    }
  } catch (err) {
    console.log("500 error in auth redirect");
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const authRedirect = async (req, res) => {
  try {
    const { email, name } = await corbado.session.getCurrentUser(req);
    console.log("User email: ", email);
    try {
      console.log("Getting user by email: ", email);
      const user = await UserService.findIdByEmail(email);
      if (!user) {
        // Create new user
        console.log("Creating new user with email: ", email);
        UserService.create(email, name).then((u) => {
          console.log("User created: ", u);
          res.redirect("/profile");
        });
      } else {
        // User already exists
        console.log("User found: ", user);
        res.redirect("/profile");
      }
    } catch (err) {
      console.log("500 error in auth redirect");
      console.error(err);
      res.status(500).send("Server Error");
    }
  } catch (err) {
    console.log("401 error in auth redirect");
    res.status(401).json({});
  }
};
