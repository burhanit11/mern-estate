import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(errorHandler(403, "Unauthorized Token"));
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
