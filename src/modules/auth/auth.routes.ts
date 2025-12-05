import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/signup", authControllers.signUpUsers);

router.post("/signin", authControllers.signInUsers);

export const authRoutes = router;
