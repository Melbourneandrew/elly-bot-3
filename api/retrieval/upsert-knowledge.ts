import { pineconeClient } from "../pcone";
import { QueryResponse } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { OpenAI } from "openai";
import { DescribeIndexStatsResponse } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/models/DescribeIndexStatsResponse";

const PINECONE_INDEX_NAME: string =
  process.env.PINECONE_INDEX_NAME || "";
const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || "";
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || "";
export async function storeKnowledge(knowledgeText: string) {
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
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  const pineconeIndex = pineconeClient.index(
    PINECONE_INDEX_NAME
  );
  //Clear all vectors pinecone index
  await pineconeIndex.namespace(PINECONE_NAMESPACE).deleteAll();

  console.log(
    "Pinecone index cleared of vectors under namespace " +
      PINECONE_NAMESPACE
  );
  //Split text on newline
  let splitText = knowledgeText.split("\n\n");
  //Remove empty strings (consecutive newlines)
  splitText = splitText.filter((text) => text !== "");

  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: splitText,
  });
  console.log("Embeddings created");
  //Process embeddings response into pinecone upsert request format
  const vectors = embeddings.data.map((embedding, index) => {
    return {
      id: "" + index,
      values: embedding.embedding,
      metadata: { text: splitText[index] },
    };
  });
  console.log(
    "Embeddings processed into pinecone upsert request format"
  );
  //Upsert vectors into pinecone index
  const pineconeUpsertResponse = await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .upsert(vectors);
  console.log("Vectors upserted");
  return true;
}
