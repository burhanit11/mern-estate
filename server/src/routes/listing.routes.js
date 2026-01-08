import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListing,
  getOneListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/verifyUser.js";

const Router = express.Router();

Router.route("/create-listing").post(
  upload.array("images"),
  verifyToken,
  createListing
);
Router.route("/update/:id").post(
  upload.array("images"),
  verifyToken,
  updateListing
);
Router.route("/get/:id").get(verifyToken, getListing);
Router.route("/delete/:id").delete(verifyToken, deleteListing);
Router.route("/getOne/:id").get(getOneListing);
Router.route("/get-all-listing").get(getAllListings);

export default Router;
