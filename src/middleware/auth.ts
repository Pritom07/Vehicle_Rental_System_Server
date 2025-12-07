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

    const isOwnAllowed =
      roles.includes("own") && req.user.id == req.params.userId;

    if (roles.includes(req.user.role) || isOwnAllowed) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "You are not allowed to perform this action",
    });
  };
};

export default auth;
