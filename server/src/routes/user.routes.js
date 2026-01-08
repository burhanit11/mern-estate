import express from "express";
import {
  deleteUser,
  getUser,
  google,
  signin,
  signout,
  signup,
  updatedUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";
import { upload } from "../middlewares/multer.middlewares.js";

const Router = express.Router();

Router.route("/signup").post(upload.single("photo"), signup);
Router.route("/signin").post(signin);
Router.route("/google").post(google);
Router.route("/signout").get(signout);
Router.route("/update/:id").post(
  upload.single("photo"),
  verifyToken,
  updatedUser
);
Router.route("/getUser/:id").get(verifyToken, getUser);
Router.route("/delete/:id").delete(verifyToken, deleteUser);

export default Router;
