import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}
export interface ChatRequest extends Request {
  chatId?: any;
}
