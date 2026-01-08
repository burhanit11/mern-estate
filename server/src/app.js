import express from "express";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(cookieParser());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// test Api
app.get("/test", (req, res) => {
  res.send("Backend is live! 🎉");
});

// Api
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

export { app };
