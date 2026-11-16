// src/auth.config.js
// Callbacks jwt dan session yang lengkap (dengan validasi DB) ada di auth.js
// File ini hanya dipakai oleh middleware (Edge runtime) yang tidak bisa akses DB
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // jwt dan session minimal untuk middleware Edge — tidak ada akses DB
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
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
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [], // Providers didefinisikan di auth.js
};
