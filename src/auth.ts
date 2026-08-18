import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "@/lib/db-connect";
import User from "@/models/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    /**
     * Runs only on first sign-in (when `user` is present). Upserts the
     * profile and pins the Mongo _id onto the token so every later request
     * carries a server-verified identity.
     */
    async jwt({ token, user }) {
      if (user?.email) {
        await dbConnect();
        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          {
            fullname: user.name ?? user.email,
            image: user.image ?? "",
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        token.userId = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      return session;
    },
  },
});
