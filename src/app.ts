import express, { Request, Response } from "express";
import config from "./config";

const app = express();
export const port = config.port;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System");
});

export default app;
