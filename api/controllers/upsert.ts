import { Request, Response } from "express";
import { storeKnowledge } from "../retrieval/upsert-knowledge";
import KnowledgeProfile from "../models/KnowledgeProfile";
export default async function (req: Request, res: Response) {
  console.log("Upsert request for " + req.body.knowledge);
  const knowledge = req.body.knowledge;
  if (knowledge) {
    await storeKnowledge(knowledge);
    return res.status(200).send("Upserted provided knowledge");
  }
  //Get knowledge from database
  const knowledgeProfile = await KnowledgeProfile.findOne({
    profileName: "Elle",
  });
  if (!knowledgeProfile)
    return res.status(404).send("Knowledge not found");

  await storeKnowledge(knowledgeProfile.knowledgeBase);
  return res.status(200).send(knowledge);
}
