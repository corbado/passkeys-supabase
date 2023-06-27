import * as UserService from "../services/userService.js";
import { SDK, Configuration } from "@corbado/node-sdk";

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
const corbado = new SDK(config);

export const home = (req, res) => {
  res.redirect("/login");
};

export const login = (req, res) => {
  res.render("pages/login");
};

export const profile = async (req, res) => {
  const { authenticated, email } = await corbado.session.getCurrentUser(req);

  if (!authenticated) {
    return res.redirect("/logout");
  }

  try {
    const user = await UserService.findByEmail(email);
    console.log("FindById result: ", user);
    if (!user) {
      res.redirect("/logout");
    } else {
      TodoService.findByUserID(user.id).then((todos) => {
        if (todos.length == 0) {
          todoText = "No todos found";
        } else {
          todoText = "";
          todos.forEach((todo) => {
            todoText += "ID: " + todo.id + ", Title: " + todo.Title + "\n";
          });
        }

        res.render("pages/profile", {
          username: user.email,
          userFullName: user.user_metadata.name,
          supabaseID: user.id,
          corbadoID: user.user_metadata.corbadoId,
          todos: todoText,
        });
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

export const authRedirect = async (req, res) => {
  try {
    const { email, name } = await corbado.session.getCurrentUser(req);
    try {
      const user = await UserService.findByEmail(email);
      if (!user) {
        // Create new user
        console.log("Creating new user with email: ", username);
        UserService.create(username, userFullName, userID).then((user) => {
          console.log("User created: ", user);
          res.redirect("/profile");
        });
      } else {
        // User already exists
        console.log("User found: ", user);
        res.redirect("/profile");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  } catch (err) {
    res.status(401).json({});
  }
};
