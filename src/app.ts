import express, { Request, Response } from "express";
import config from "./config";
import initTable from "./config/db";

const app = express();
export const port = config.port;

app.use(express.json());

initTable();

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System");
});

export default app;
