import dotenv from "dotenv";
import { app } from "./app.js";
import conntectDB from "./utils/connectDB.js";

dotenv.config({});
const PORT = process.env.PORT;

conntectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Is Running On PORT: ${PORT}`);
    });
  })
  .catch((err) => console.log(`MongoDB Connaction failed! ${err}`));
