import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ChatRequest } from "../types";

const TOKEN_HASH = process.env.JWT_SECRET || "";
if (!TOKEN_HASH) throw new Error("JWT secret not set");

export default function parseJWT(
  req: ChatRequest,
  res: Response,
  next: any
) {
  console.log(req.cookies);
  const token = req.cookies.chatId;
  if (!token) {
    req.chatId = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, TOKEN_HASH);
    req.chatId = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
