import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehiclesController.addVehicles);

router.get("/", vehiclesController.viewAllVehicles);

router.get("/:vehicleId", vehiclesController.viewVehicle);

export const vehiclesRoutes = router;
