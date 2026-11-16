import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const session = request.auth;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthApiRoute = request.nextUrl.pathname.startsWith("/api/auth");

  if (isPublicRoute || isAuthApiRoute) {
    if (session && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register"))) {
      return Response.redirect(new URL("/", request.url));
    }
    return null;
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
