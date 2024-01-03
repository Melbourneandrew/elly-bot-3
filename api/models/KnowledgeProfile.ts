import mongoose, { models, Schema, Document } from "mongoose";

interface IKnowledgeProfile extends Document {
  profileName: string;
  persistentMessage: string;
  knowledgeBase: string;
}

const knowledgeProfileSchema: Schema = new Schema({
  profileName: {
    type: String,
    default: "",
  },
  persistentMessage: {
    type: String,
    default: "Hello! I am a chatbot. How can I help you?",
  },
  knowledgeBase: {
    type: String,
    default: "",
  },
});

const KnowledgeProfileModel =
  models.KnowledgeProfile ||
  mongoose.model<IKnowledgeProfile>(
    "KnowledgeProfile",
    knowledgeProfileSchema
  );
export default KnowledgeProfileModel;
export type { IKnowledgeProfile };
