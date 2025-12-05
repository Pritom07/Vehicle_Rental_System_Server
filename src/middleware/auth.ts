import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing Authentication Token",
      });
    }
    const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
    req.user = decoded;
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can add vehicle",
      });
    }
    next();
  };
};

export default auth;
