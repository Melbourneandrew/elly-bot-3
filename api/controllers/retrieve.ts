import { Request, Response } from "express";
import { retrieveKnowledge } from "../retrieval/retrieve-knowledge";
export default async function (req: Request, res: Response) {
  console.log("Retrieval request for " + req.body.query);
  const query = req.body.query;
  if (!query) return res.status(400).send("Query not provided");

  const knowledge = await retrieveKnowledge(query);
  return res.status(200).send(knowledge);
}
