import mongoose, { Schema, Document } from "mongoose";

export default interface IChatHistory {
  initiatedAt: Date;
  history: Array<{
    content: string;
    role: "function" | "user" | "assistant" | "system" | "tool";
  }>;
}
const ChatHistorySchema: Schema = new Schema({
  initiatedAt: { type: Date, required: true },
  history: { type: Array, required: true },
});

const ChatHistory = mongoose.model<IChatHistory>(
  "ChatHistory",
  ChatHistorySchema
);
export { IChatHistory, ChatHistory };
