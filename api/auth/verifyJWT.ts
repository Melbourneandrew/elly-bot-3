import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";

const TOKEN_HASH = process.env.JWT_SECRET || "";
if (!TOKEN_HASH) throw new Error("JWT secret not set");

export default function verifyJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: any
) {
  console.log("Verifying JWT");
  const token = req.cookies.token;
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_HASH);
    req.user = decoded;
    console.log("JWT verified");
    next();
  } catch (error) {
    console.log("Invalid token");
    return res.status(403).json({ message: "Invalid token" });
  }
}
