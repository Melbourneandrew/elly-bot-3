import { ChatHistory } from "../models/ChatHistory";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const history = await ChatHistory.find();
  res.json(history);
}
