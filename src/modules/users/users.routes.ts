import { Router } from "express";
import { userControllers } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin"), userControllers.viewAllUsers);

router.put("/:userId", auth("admin", "own"), userControllers.updateUsers);

export const userRoutes = router;
