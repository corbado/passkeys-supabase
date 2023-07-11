import * as UserService from "../services/userService.js";
import { SDK, Configuration } from "@corbado/node-sdk";

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

export const logout = (req, res) => {
  res.redirect("/");
};

export const profile = async (req, res) => {
  try {
    const { email, name } = await corbado.session.getCurrentUser(req);
    const user = await UserService.findByEmail(email);
    const userId = user?.id;
    if (!userId) {
      // Create new user
      UserService.create(email, name).then((u) => {
        if (u == null) {
          res.redirect("/logout");
        } else {
          const user = u.user;
          res.render("pages/profile", {
            username: user.email,
            userFullName: user.user_metadata.name,
            supabaseID: user.id,
          });
        }
      });
    } else {
      // User already exists
      res.render("pages/profile", {
        username: user.email,
        userFullName: user.user_metadata.name,
        supabaseID: user.id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
