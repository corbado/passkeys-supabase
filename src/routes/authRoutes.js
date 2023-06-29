import express from "express";
import {
  home,
  login,
  profile,
  logout,
  authRedirect,
} from "../controllers/authController.js";

const router = express.Router();

// home page
router.get("/", home);
// login page
router.get("/login", login);
// user profile page
router.get("/profile", profile);
// logout page
router.get("/logout", logout);
// redirect URL for corbado auth
router.get("v", authRedirect);

export default router;
