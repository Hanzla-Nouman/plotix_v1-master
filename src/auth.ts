import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { providers } from "./auth.config";
import { prisma } from "@/prisma";
import { UserWithRelations } from "@/TSChema";

const filterNil = (obj: object) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  );
const extractUserData = (data: UserWithRelations) => {
  return filterNil({
    id: data.id,
    role: data.role,
    email: data.email,
    coachId: data.coach?.id,
    name: data.name,
    avatar: data.avatar?.url,
  });
};

const nextAuthCfg: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days 
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }

      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData?.emailVerified) {
        return false;
      }

      return true;
    },
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update" && session) {
        return {
          ...token,
          ...extractUserData(session),
        };
      }
      if (user) {
        return {
          ...token,
          ...extractUserData(user as UserWithRelations),
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
    verifyRequest: "/verify-email",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthCfg);
