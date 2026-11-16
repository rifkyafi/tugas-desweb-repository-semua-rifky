"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/lib/images/logo.png";
import { FiLock, FiSun, FiMoon, FiAlertCircle, FiGithub } from "react-icons/fi";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    urlError === "OAuthAccountNotFound"
      ? "Akun belum terdaftar. Silakan daftar terlebih dahulu."
      : urlError === "AlreadyRegistered"
      ? "Akun sudah terdaftar. Silakan masuk dengan Google atau GitHub."
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        setError("Email atau password salah.");
      }
    } catch (err) {
      // NextAuth melempar error 'GoogleAccountNotFound' dari authorize
      if (err?.message?.includes("GoogleAccountNotFound")) {
        setError("Akun Google tidak ditemukan. Gunakan tombol \"Masuk dengan Google\".");
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const bgColor = isDark ? "#000000" : "#ffffff";
  const textColor = isDark ? "#eaeaea" : "#1f2937";
  const borderColor = isDark ? "#2a2a30" : "#e5e7eb";
  const inputBg = isDark ? "#000000" : "#ffffff";
  const outlineColor = isDark ? "#eaeaea" : "#eaeaea";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full border flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{ borderColor, backgroundColor: inputBg }}
        title="Toggle theme"
      >
        {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 flex justify-center">
            <Image src={logo} alt="" width={100} height={100} loading="eager"/>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Groq<span style={{ color: "var(--accent)" }}>Chat</span>
          </h1>
          <p
            className="text-sm"
            style={{ color: isDark ? "#6b6b7d" : "#6b7280" }}
          >
            Chatbot AI ultra-cepat dengan Groq
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
              className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all text-sm"
              style={{
                backgroundColor: inputBg,
                borderColor,
                color: textColor,
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = outlineColor;
                e.currentTarget.style.outlineColor = outlineColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.outline = "none";
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all text-sm"
              style={{
                backgroundColor: inputBg,
                borderColor,
                color: textColor,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = outlineColor;
                e.currentTarget.style.outlineColor = outlineColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.outline = "none";
              }}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
              <FiAlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-medium transition-all hover:opacity-85 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Sedang masuk...</span>
            ) : (
              <>
                <FiLock size={16} /> Masuk
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: borderColor }}
          />
          <span style={{ color: isDark ? "#6b6b7d" : "#9ca3af" }}>atau</span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: borderColor }}
          />
        </div>

        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full py-2.5 rounded-lg border font-medium transition-all hover:opacity-85 hover:scale-105 flex items-center justify-center gap-2"
          style={{
            backgroundColor: inputBg,
            borderColor,
            color: textColor,
          }}
        >
          <FiGithub size={18} /> Masuk dengan GitHub
        </button>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-2.5 rounded-lg border font-medium transition-all hover:opacity-85 hover:scale-105 flex items-center justify-center gap-2 mt-3"
          style={{
            backgroundColor: inputBg,
            borderColor,
            color: textColor,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Masuk dengan Google
        </button>

        <p className="text-center text-sm">
          <span style={{ color: isDark ? "#6b6b7d" : "#6b7280" }}>
            Belum punya akun?{" "}
          </span>
          <Link
            href="/register"
            className="font-semibold text-[var(--accent)] hover:opacity-80 transition-colors"
          >
            Daftar di sini
          </Link>
        </p>

        <div
          className="mt-8 text-center text-xs"
          style={{ color: isDark ? "#6b6b7d" : "#9ca3af" }}
        >
          Powered by Groq · llama-3.3-70b-versatile
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Memuat...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
