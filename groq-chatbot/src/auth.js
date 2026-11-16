// src/auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { authConfig } from "./auth.config";
import { sendWelcomeEmail } from "@/lib/mailer";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );
          const user = rows[0];

          // Akun tidak ditemukan
          if (!user) {
            // Tandai sebagai Google email agar frontend bisa menampilkan pesan tepat
            const emailLower = credentials.email.toLowerCase();
            const isGoogleEmail =
              emailLower.endsWith("@gmail.com") ||
              emailLower.endsWith("@googlemail.com");
            if (isGoogleEmail) {
              throw new Error("GoogleAccountNotFound");
            }
            return null;
          }

          // Akun terdaftar via OAuth (tidak punya password)
          if (!user.password) {
            throw new Error("GoogleAccountNotFound");
          }

          const passwordMatch = await bcryptjs.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          if (error.message === "GoogleAccountNotFound") throw error;
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Saat login pertama, simpan id ke token
      if (user) {
        token.id = user.id;
        token.deleted = false;
      }

      // Validasi ke DB setiap kali token digunakan (bukan hanya saat login)
      // Ini memastikan akun yang dihapus langsung kehilangan akses
      if (token.id && trigger !== "signIn" && trigger !== "signUp") {
        try {
          const [rows] = await pool.execute(
            "SELECT id FROM users WHERE id = ?",
            [token.id]
          );
          if (rows.length === 0) {
            // Akun tidak ditemukan di DB, invalidate token
            token.deleted = true;
          }
        } catch (err) {
          console.error("[Auth] Gagal validasi user ke DB:", err.message);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.deleted = token.deleted || false;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const email = user.email;
          if (!email) return false;

          // Cek apakah ini alur REGISTRASI via OAuth (dari tombol register page)
          const cookieStore = await cookies();
          const isRegistration = cookieStore.get("oauth_register_intent")?.value === "true";
          if (isRegistration) {
            cookieStore.delete("oauth_register_intent");
          }

          const [existingRows] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
          );

          if (existingRows.length > 0) {
            user.id = existingRows[0].id.toString();
            if (isRegistration) {
              return "/login?error=AlreadyRegistered";
            }
            return true;
          }

          if (isRegistration) {
            const providerName = account.provider === "google" ? "Google User" : "GitHub User";
            const [result] = await pool.execute(
              "INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
              [user.name || providerName, email]
            );
            user.id = result.insertId.toString();
            sendWelcomeEmail(email, user.name || providerName).catch(err => {
              console.error('[Auth] Gagal kirim welcome email:', err.message);
            });
            return true;
          }

          // Alur LOGIN tapi akun belum terdaftar
          return "/register?error=OAuthAccountNotFound";
        } catch (error) {
          console.error(`${account.provider} sign-in error:`, error);
          return false;
        }
      }

      return true;
    },
  },
});