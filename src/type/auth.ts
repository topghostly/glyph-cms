import { Session } from "next-auth";

export interface Auth {
  session: Session | null;
  updateSession: (session: Session | null) => void;
}
