// @ts-nocheck
import { Request, Response } from "express";
import { ChatRequest } from "../types";
import {
  ChatHistory,
  IChatHistory,
} from "../models/ChatHistory";
import { Document, Types } from "mongoose";
import OpenAI from "openai";
import KnowledgeProfile from "../models/KnowledgeProfile";
import { retrieveKnowledge } from "../retrieval/retrieve-knowledge";
export default async function chat(
  req: ChatRequest,
  res: Response
) {
  console.log(
    "Chat request for user " +
      req.body.chatId +
      " with message " +
      req.body.message
  );
  console.log(req.body);
  const chatId = req.body.chatId;
  const message = req.body.message;
  if (!message)
    return res.status(400).send("Message not provided");

  let chatHistory = await ChatHistory.findById(chatId);
  if (chatId == null) {
    chatHistory = new ChatHistory({
      initiatedAt: new Date(),
      history: [],
    });
    //Get system message from mongodb
    const knowledgeProfile = await KnowledgeProfile.findOne({
      profileName: "Elle",
    });
    if (!knowledgeProfile)
      return res.status(404).send("Knowledge not found");
    chatHistory.history.push({
      content: knowledgeProfile.persistentMessage,
      role: "system",
    });
  }
  //Get related vectors from knowledge base
  const knowledge = await retrieveKnowledge(message);
  const knowledgeString = knowledge.reduce((acc, cur) => {
    return acc + cur + " ";
  }, " ");
  //Remove previous knowledge from previous query
  chatHistory.history[0].content =
    chatHistory.history[0].content.replace(
      /KNOWLEDGE[\s\S]*$/,
      ""
    );
  //Add related knowledge to system message
  chatHistory.history[0].content +=
    " KNOWLEDGE: " + knowledgeString;
  //Add user message to chat history
  chatHistory?.history.push({
    content: message,
    role: "user",
  });
  //Get chat completion
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  //Reduce size of chat history for the completion if necessary
  let reducedChatHistory = chatHistory?.history;
  const chatHistoryLength = chatHistory?.history.reduce(
    (acc, cur) => {
      return acc + cur.content.length;
    },
    0
  );
  if (chatHistoryLength > 2000) {
    //Remove all but first and last 2 messages
    reducedChatHistory = [
      ...chatHistory?.history.slice(0, 2),
      ...chatHistory?.history.slice(-2),
    ];
  }
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chatHistory?.history,
  });
  //Add chat completion to chat history
  chatHistory?.history.push({
    content: chatCompletion.choices[0]?.message?.content || "",
    role: "assistant",
  });

  chatHistory?.save();
  return res.status(200).send(chatHistory);
}
