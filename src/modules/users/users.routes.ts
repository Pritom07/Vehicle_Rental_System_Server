import { Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin"), userControllers.viewAllUsers);

export const userRoutes = router;
