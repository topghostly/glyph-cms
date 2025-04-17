import { Session } from "next-auth";
import { Types } from "mongoose";

export interface Auth {
  session: Session | null;
  updateSession: (session: Session | null) => void;
  userId: Types.ObjectId | null;
  updateUserId: (userId: Types.ObjectId | null) => void;
}
