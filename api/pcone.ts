import { Pinecone } from "@pinecone-database/pinecone";
var pineconeClient: any;

function connectPinecone() {
  if (process.env.PINECONE_API_KEY === "") {
    console.error(
      "PINECONE_API_KEY environment variable not set"
    );
    return;
  }
  if (process.env.PINECONE_ENVIRONMENT === "") {
    console.error(
      "PINECONE_ENVIRONMENT environment variable not set"
    );
    return;
  }
  pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  console.log("Connected to pinecone");
}

export { pineconeClient, connectPinecone };
