import { USER_ROLE } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import { config } from "./middleware";
import { NextResponse } from "next/server";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role as USER_ROLE,
        id: token.id as string,
      };
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isSchoolAdminPath = nextUrl.pathname.startsWith("/school_admin");
      const isTeacherPath = nextUrl.pathname.startsWith("/teacher");
      const isAdminPath = nextUrl.pathname.startsWith("/admin");
      const isHomePath = nextUrl.pathname === "/";

      if (isLoggedIn) {
        if (auth?.user.role === "schoolAdmin") {
          if (isSchoolAdminPath) return true;
          else {
            return Response.redirect(
              new URL("/school_admin/dashboard", nextUrl)
            );
          }
        }
        if (auth?.user.role === "teacher") {
          if (isTeacherPath) return true;
          else return Response.redirect(new URL("/teacher/students/scores", nextUrl));
        }
      } else if (isAdminPath || isHomePath) {
        return true;
      } else {
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
