import { Request, Response } from "express";
import { storeKnowledge } from "../retrieval/upsert-knowledge";
import KnowledgeProfile from "../models/KnowledgeProfile";
export default async function (req: Request, res: Response) {
  console.log("Add Knowledge request");
  const knowledge = req.body.knowledgeBase;
  const persistentMessage = req.body.persistentMessage;
  if (!knowledge || !persistentMessage) {
    return res
      .status(400)
      .send("Missing knowledge or persistent message");
  }

  //Save new values to database database
  const knowledgeProfile = await KnowledgeProfile.findOne({
    profileName: "Elle",
  });
  knowledgeProfile.knowledgeBase = knowledge;
  knowledgeProfile.persistentMessage = persistentMessage;
  await knowledgeProfile.save();

  await storeKnowledge(knowledge);
  return res.status(200).send("Upserted provided knowledge");
}
