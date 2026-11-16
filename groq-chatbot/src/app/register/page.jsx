"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSun, FiMoon, FiAlertCircle, FiCheck, FiGithub } from "react-icons/fi";
import { signIn } from "next-auth/react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const passwordStrength = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };

  const disposableDomains = ["tempmail.com","throwaway.email","guerrillamail.com","mailinator.com","yopmail.com","10minutemail.com","trashmail.com","sharklasers.com","guerrillamailblock.com","grr.la","dispostable.com","maildrop.cc","fakeinbox.com","temp-mail.org","tempr.email","discard.email","discardmail.com","mailcatch.com","harakirimail.com","anonbox.net","binkmail.com","safetymail.info","filzmail.com","sneakemail.com","jetable.org","mailexpire.com","mytempemail.com","tempemail.net","meltmail.com","mailmoat.com","mailnesia.com","mailnull.com","mailscrap.com","getmails.eu","mailsiphon.com","mailshell.com","mailsucket.com","mailtap.info","mailzen.com","mailzader.com","oklast.com","spamgourmet.com","spambox.us","spamspot.com","spamavert.com","spamcorptastic.com","spamhole.com","spamify.com","spaminator.de","spamkill.info","spaml.com","spaml.de","spammotel.com","spamobox.com","spamoff.de","spamspot.com","spamtrail.com","spamtrap.ro","superrito.com","teleworm.us","tempalias.com","tempemail.biz","tempemail.co.za","tempemail.com","tempemail.net","tempemail.org","tempinbox.com","tempinbox.co.uk","temporaryemail.net","temporaryemail.us","temporaryforwarding.com","temporaryinbox.com","temporarymail.net","temporarymailaddress.com","tempmail2.com","tempmaildemo.com","tempmailer.com","tempmailer.de","tempomail.fr","temporarily.de","temp-mail.io","temp-mail.info","temp-mail.pro","temp-mail.ru","thc.st","thecloudindex.com","trash2009.com","trashdevil.com","trashdevil.de","trashemail.de","trashmail.at","trashmail.com","trashmail.de","trashmail.me","trashmail.net","trashmail.org","trashmail.ws","trashmailer.com","trashmailer.net","trashymail.com","trashymail.net","wegwerfemail.com","wegwerfemail.de","wegwerfmail.net","wegwerfmail.org","xagloo.com","xoxy.net"];

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const domain = email.split("@")[1]?.toLowerCase();
      if (domain && disposableDomains.includes(domain)) {
        setError("Email disposable tidak diperbolehkan. Gunakan email asli.");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal.");
        return;
      }

      setSuccess("Akun berhasil dibuat! Mengalihkan ke login...");
      router.push("/login");
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Buat Akun
          </h1>
          <p
            className="text-sm"
            style={{ color: isDark ? "#6b6b7d" : "#6b7280" }}
          >
            Daftar untuk mulai menggunakan GroqChat
          </p>
        </div>

        {urlError === "OAuthAccountNotFound" && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-start gap-2">
            <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Akun dengan email Google/GitHub kamu belum terdaftar.
              Daftar dulu di bawah, lalu login menggunakan Google atau GitHub.
            </span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budi Santoso"
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@contoh.com"
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
            {password && (
              <div className="mt-2 space-y-1.5">
                <div className="text-xs" style={{ color: isDark ? "#6b6b7d" : "#6b7280" }}>
                  Kekuatan password:
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: passwordStrength.length
                          ? "#10b981"
                          : "#6b6b7d",
                      }}
                    />
                    Minimal 8 karakter {passwordStrength.length && "✓"}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: passwordStrength.hasNumber
                          ? "#10b981"
                          : "#6b6b7d",
                      }}
                    />
                    Mengandung angka {passwordStrength.hasNumber && "✓"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all text-sm"
              style={{
                backgroundColor: inputBg,
                borderColor:
                  confirmPassword &&
                  password !== confirmPassword &&
                  "#ef4444"
                    ? "#ef4444"
                    : borderColor,
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
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> Password tidak cocok
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2">
              <FiAlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-sm flex items-center gap-2">
              <FiCheck size={16} /> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || !name || password !== confirmPassword}
            className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-medium transition-all hover:opacity-85 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sedang membuat akun..." : "Daftar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: borderColor }}
          />
          <span style={{ color: isDark ? "#6b6b7d" : "#9ca3af" }}>atau daftar dengan</span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: borderColor }}
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              document.cookie = "oauth_register_intent=true; path=/; max-age=300; samesite=lax";
              signIn("google", { callbackUrl: "/" });
            }}
            className="w-full py-2.5 rounded-lg border font-medium transition-all hover:opacity-85 hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: inputBg, borderColor, color: textColor }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Daftar dengan Google
          </button>

          <button
            onClick={() => {
              document.cookie = "oauth_register_intent=true; path=/; max-age=300; samesite=lax";
              signIn("github", { callbackUrl: "/" });
            }}
            className="w-full py-2.5 rounded-lg border font-medium transition-all hover:opacity-85 hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: inputBg, borderColor, color: textColor }}
          >
            <FiGithub size={18} /> Daftar dengan GitHub
          </button>
        </div>

        <p className="text-center text-sm mt-6">
          <span style={{ color: isDark ? "#6b6b7d" : "#6b7280" }}>
            Sudah punya akun?{" "}
          </span>
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:opacity-80 transition-colors"
          >
            Masuk di sini
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Memuat...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
