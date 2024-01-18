import { ChatHistory } from "../models/ChatHistory";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  await ChatHistory.deleteMany();
  res.json({ deleted: true });
}
