import KnowledgeProfileModel from "../models/KnowledgeProfile";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const knowledge = await KnowledgeProfileModel.findOne({
    profileName: "Elle",
  });
  res.json(knowledge);
}
