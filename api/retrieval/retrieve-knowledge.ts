import { pineconeClient } from "../pcone";
import { QueryResponse } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
const PINECONE_INDEX_NAME: string =
  process.env.PINECONE_INDEX_NAME || "";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || "";
export async function retrieveKnowledge(query: string) {
  if (PINECONE_INDEX_NAME === "") {
    console.error(
      "PINECONE_INDEX_NAME environment variable not set"
    );
    return [];
  }
  if (OPENAI_API_KEY === "") {
    console.error(
      "OPENAI_API_KEY environment variable not set"
    );
    return [];
  }
  if (PINECONE_NAMESPACE === "") {
    console.error(
      "PINECONE_NAMESPACE environment variable not set"
    );
    return [];
  }

  const pineconeIndex = pineconeClient.index(
    PINECONE_INDEX_NAME
  );
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });
  console.log(embeddings.data[0].embedding);
  const queryResponse: QueryResponse = await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .query({
      vector: embeddings.data[0].embedding,
      topK: 5,
      includeMetadata: true,
    });
  console.log(queryResponse.matches);
  const knowledge: string[] = [];
  queryResponse.matches?.forEach((match) => {
    // @ts-ignore
    knowledge.push(match.metadata?.text);
  });
  console.log("Knowledge vectors retrieved from Pinecone");
  console.log(knowledge);
  return knowledge;
}
