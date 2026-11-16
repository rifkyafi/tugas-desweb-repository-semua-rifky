// src/app/api/auth/oauth-register/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signIn } from "@/auth";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const provider = searchParams.get("provider") || "google";
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const cookieStore = await cookies();
  cookieStore.set("oauth_register_intent", "true", {
    maxAge: 300,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  const redirectUrl = await signIn(provider, {
    redirectTo: callbackUrl,
    redirect: false,
  });

  return NextResponse.redirect(redirectUrl);
}
