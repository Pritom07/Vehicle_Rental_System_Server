import express, { Request, Response } from "express";
import config from "./config";
import initTable from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";

const app = express();
export const port = config.port;

app.use(express.json());

initTable();

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/bookings", bookingsRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System");
});

export default app;
