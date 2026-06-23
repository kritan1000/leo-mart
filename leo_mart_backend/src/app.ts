import express, { Application, NextFunction, Request, Response } from "express";
import { ApiResponseHelper } from "./utils/api-response";
import { HttpException } from "./exceptions/http-exception";
import cors from "cors";
import userRoutes from "./routes/user_route";

const app: Application = express();
let corsOptions = {
  origin: ["*"], // {"http://localhost:300", "http://example.com"}
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json()); // use json as request
app.use(express.urlencoded({ extended: true })); //use form-urlencoded as request

app.use("/api/v1/auth", userRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "Route Not Found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

export default app;
