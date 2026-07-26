import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { PORT } from "./config/constant";
import { connectToMongoDB } from "./database/mongo-db";

connectToMongoDB()
  .then(() => {
    console.log("MongoDB connection established, starting server...");
    app.listen(PORT, () => {
      console.log(`Server running :${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB, server not started.", error);
    process.exit(1);
  });
