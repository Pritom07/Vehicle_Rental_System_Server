import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signUpUsers = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signUpUsers(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

const signInUsers = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signInUsers(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token: result?.token, user: result?.user },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Error Occured : ${err.message}`,
    });
  }
};

export const authControllers = { signUpUsers, signInUsers };
