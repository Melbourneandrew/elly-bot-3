import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { connectPinecone } from "./pcone";
import verifyJWT from "./auth/verifyJWT";
import login from "./controllers/login";
import signup from "./controllers/signup";
import chat from "./controllers/chat";
import retrieve from "./controllers/retrieve";
import upsert from "./controllers/upsert";
import knowledge from "./controllers/knowledge";
import addKnowledge from "./controllers/addKnowledge";
import history from "./controllers/history";
import clearHistory from "./controllers/clearHistory";
const MONGO_DB_URI = process.env.MONGO_DB_URI || "";
if (!MONGO_DB_URI) throw new Error("MongoDB URI not set");

mongoose.connect(MONGO_DB_URI).then(() => {
  console.log("Connected to MongoDB");
});
connectPinecone();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.post("/login", login);
app.post("/signup", signup);
app.post("/chat", chat);
app.get(
  "/protected",
  verifyJWT,
  (req: Request, res: Response) => {
    res.send("Protected route. You are logged in.");
  }
);
app.post("/retrieve", retrieve);
app.post("/upsert", upsert);

app.get("/knowledge", verifyJWT, knowledge);
app.post("/add-knowledge", verifyJWT, addKnowledge);

app.get("/history", verifyJWT, history);
app.get("/clear-history", verifyJWT, clearHistory);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
