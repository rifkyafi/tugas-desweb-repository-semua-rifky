"use client";

import { useState, useEffect, useRef } from "react";

const SALAM_BOY = [
  { salam: "Assalamu'alaikum! 👋", motivasi: ["Semangat", "Ikhlas", "Tawakal"] },
  { salam: "Halo, salam kenal! 😊", motivasi: ["Amanah", "Istiqomah", "Sabar"] },
  { salam: "Hai, selamat datang!", motivasi: ["Bersyukur", "Tawadhu", "Lillah"] },
  { salam: "Apa kabar hari ini? 🌤️", motivasi: ["Ridho", "Qona'ah", "Syukur"] },
  { salam: "Hei, senyum dong! 😄", motivasi: ["Ilmu", "Akhlak", "Adab"] },
  { salam: "Semangat, jangan menyerah! 💪", motivasi: ["Tekad", "Doa", "Usaha"] },
  { salam: "Jaga sholat ya~ 🕌", motivasi: ["Khusyuk", "Taqwa", "Dzikir"] },
  { salam: "Hei, senyum dong! 😄", motivasi: ["Shodaqoh", "Ramah", "Mulia"] },
  { salam: "Bismillah mulai harinya! ☀️", motivasi: ["Niat", "Bismillah", "Barokah"] },
  { salam: "Allahu Akbar! 🌙", motivasi: ["Iman", "Taqwa", "Hidayah"] },
  { salam: "Jangan lupa bersyukur! 🤲", motivasi: ["Nikmat", "Syukur", "Sabar"] },
  { salam: "Terus berkarya ya! ✨", motivasi: ["Kreatif", "Amanah", "Gigih"] },
];

const SALAM_GIRL = [
  { salam: "Wa'alaikumussalam! 🌸", motivasi: ["Ihsan", "Rezeki", "Barakah"] },
  { salam: "Halo! Semangat ya~ 🌺", motivasi: ["Ikhlas", "Sabar", "Tawakal"] },
  { salam: "Assalamu'alaikum! ✨", motivasi: ["Amanah", "Istiqomah", "Lillah"] },
  { salam: "Hai, apa kabarnya? 🌼", motivasi: ["Syukur", "Qona'ah", "Ridho"] },
  { salam: "Tetap semangat belajar! 📖", motivasi: ["Ilmu", "Adab", "Akhlak"] },
  { salam: "Senyum itu shodaqoh~ 😊", motivasi: ["Ramah", "Mulia", "Ikhlas"] },
  { salam: "Jaga hijabmu ya~ 🌷", motivasi: ["Iffah", "Taqwa", "Muruah"] },
  { salam: "Bismillah, kita bisa! 💫", motivasi: ["Niat", "Doa", "Ikhtiar"] },
  { salam: "Yuk, rajin tilawah! 📿", motivasi: ["Quran", "Dzikir", "Khusyuk"] },
  { salam: "Alhamdulillah indah ya! 🌈", motivasi: ["Syukur", "Nikmat", "Barokah"] },
  { salam: "Jangan lupa sholat dhuha! 🕊️", motivasi: ["Rezeki", "Tawakkal", "Dhuha"] },
  { salam: "Semoga hari ini berkah~ 🤲", motivasi: ["Berkah", "Ridho", "Iman"] },
];

export default function BeachCharacter({
  jenis,
  durasiPerjalanan,
  delay,
  posisiBawah,
  variant = 1,
}) {
  const [showBubble, setShowBubble] = useState(false);
  const [clicked, setClicked] = useState(false);
  const intervalRef = useRef(null);
  const t1Ref = useRef(null);
  const t2Ref = useRef(null);

  const isBoy = jenis === "laki-laki";
  const salamList = isBoy ? SALAM_BOY : SALAM_GIRL;
  const [salamIndex, setSalamIndex] = useState(() =>
    Math.floor(Math.random() * salamList.length)
  );
  const salamData = salamList[salamIndex];
  const durasisNum = parseFloat(durasiPerjalanan);

  // Auto-show bubble at mid-journey, pick random salam each time
  useEffect(() => {
    const halfMs = (durasisNum * 1000) / 2;

    const trigger = () => {
      if (clicked) return;
      setSalamIndex(Math.floor(Math.random() * salamList.length));
      setShowBubble(true);
      t2Ref.current = setTimeout(() => setShowBubble(false), 3500);
    };

    t1Ref.current = setTimeout(trigger, halfMs * 0.6);
    intervalRef.current = setInterval(trigger, durasisNum * 1000);

    return () => {
      clearTimeout(t1Ref.current);
      clearTimeout(t2Ref.current);
      clearInterval(intervalRef.current);
    };
  }, [durasisNum, clicked, salamList.length]);

  const handleClick = () => {
    setClicked(true);
    setShowBubble(true);
    clearTimeout(t2Ref.current);
    t2Ref.current = setTimeout(() => {
      setShowBubble(false);
      setClicked(false);
    }, 4000);
  };

  // Scale based on depth (posisiBawah closer to bottom = bigger)
  const scaleMap = { 1: 0.72, 2: 0.85, 3: 1.0 };
  const scale = scaleMap[variant] ?? 1.0;

  return (
    <div
      className={`walker cursor-pointer pointer-events-auto ${showBubble && clicked ? "is-paused" : ""}`}
      onClick={handleClick}
      style={{
        bottom: posisiBawah,
        "--durasi-perjalanan": durasiPerjalanan,
        "--delay-perjalanan": delay,
      }}
      aria-hidden="true"
    >
      <div className="walker-inner relative flex flex-col items-center" style={{ transform: `scale(${scale})`, transformOrigin: "bottom center" }}>
        {/* Speech bubble */}
        <div
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 ${
            showBubble
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-90 pointer-events-none"
          }`}
        >
          <div className="bg-white dark:bg-[#1e2d4f] rounded-2xl px-3 py-2 shadow-lg text-center whitespace-nowrap border border-white/60 dark:border-[#3a5580] min-w-[110px]">
            <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-tight">
              {salamData.salam}
            </p>
            <div className="flex gap-1 mt-1 justify-center flex-wrap">
              {salamData.motivasi.map((m, i) => (
                <span
                  key={i}
                  className="text-[8px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          {/* Tail */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-[#1e2d4f]" />
        </div>

        {/* 2D Character SVG */}
        {isBoy ? <BoyCharacter variant={variant} /> : <GirlCharacter variant={variant} />}
      </div>
    </div>
  );
}

/* ── Boy Character ─────────────────────────────────────── */
function BoyCharacter({ variant }) {
  const shirtColor = variant === 2 ? "#3ab06e" : variant === 3 ? "#e8a020" : "#3b82f6";
  const pantsColor = variant === 2 ? "#5c9e6e" : variant === 3 ? "#1b5e8e" : "#1b4fc8";

  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      fill="none"
      className="character-body drop-shadow-md"
    >
      {/* Ground shadow */}
      <ellipse cx="20" cy="59" rx="9" ry="2" fill="rgba(0,0,0,0.12)" />

      {/* Left leg */}
      <g className="limb-right" style={{ transformOrigin: "15px 42px" }}>
        <rect x="11" y="42" width="8" height="13" rx="4" fill={pantsColor} />
        <ellipse cx="15" cy="55.5" rx="6" ry="2.5" fill="#2c3e50" />
      </g>

      {/* Right leg */}
      <g className="limb-left" style={{ transformOrigin: "25px 42px" }}>
        <rect x="21" y="42" width="8" height="13" rx="4" fill={pantsColor} />
        <ellipse cx="25" cy="55.5" rx="6" ry="2.5" fill="#2c3e50" />
      </g>

      {/* Body */}
      <rect x="11" y="27" width="18" height="17" rx="6" fill={shirtColor} />
      <path d="M17 27 Q20 31 23 27" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Left arm */}
      <g className="limb-left" style={{ transformOrigin: "12px 29px" }}>
        <rect x="6" y="28" width="8" height="12" rx="4" fill="#c8956b" />
        <circle cx="10" cy="41" r="3.5" fill="#c8956b" />
      </g>

      {/* Right arm */}
      <g className="limb-right" style={{ transformOrigin: "28px 29px" }}>
        <rect x="26" y="28" width="8" height="12" rx="4" fill="#c8956b" />
        <circle cx="30" cy="41" r="3.5" fill="#c8956b" />
      </g>

      {/* Neck */}
      <rect x="17" y="20" width="6" height="8" rx="3" fill="#c8956b" />

      {/* Head */}
      <ellipse cx="20" cy="14" rx="11" ry="12" fill="#d4a574" />
      <ellipse cx="20" cy="16" rx="8" ry="8" fill="#c8956b" opacity="0.25" />

      {/* Eyes */}
      <ellipse cx="16" cy="13" rx="2.2" ry="2.5" fill="white" />
      <ellipse cx="24" cy="13" rx="2.2" ry="2.5" fill="white" />
      <ellipse cx="16" cy="13.5" rx="1.3" ry="1.5" fill="#2c1a0e" />
      <ellipse cx="24" cy="13.5" rx="1.3" ry="1.5" fill="#2c1a0e" />
      <circle cx="16.5" cy="12.8" r="0.5" fill="white" />
      <circle cx="24.5" cy="12.8" r="0.5" fill="white" />

      {/* Smile */}
      <path d="M16.5 17.5 Q20 21 23.5 17.5" stroke="#8b5e3c" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Kopiah */}
      <ellipse cx="20" cy="5.5" rx="11.5" ry="3.5" fill="#2c3e50" />
      <rect x="8.5" y="2" width="23" height="6" rx="3" fill="#34495e" />
      <rect x="9" y="1.5" width="22" height="5.5" rx="2.5" fill="#2c3e50" />
      <rect x="10" y="2" width="20" height="2" rx="1" fill="#4a6080" opacity="0.4" />
    </svg>
  );
}

/* ── Girl Character ────────────────────────────────────── */
function GirlCharacter({ variant }) {
  const hijabColor = variant === 2 ? "#9c27b0" : variant === 3 ? "#29b6f6" : "#d81b60";
  const dressColor = variant === 2 ? "#7b1fa2" : variant === 3 ? "#0277bd" : "#ad1457";

  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      fill="none"
      className="character-body drop-shadow-md"
    >
      {/* Ground shadow */}
      <ellipse cx="20" cy="59" rx="9" ry="2" fill="rgba(0,0,0,0.12)" />

      {/* Dress (lower) */}
      <g className="limb-right" style={{ transformOrigin: "15px 44px" }}>
        <path d="M13 44 Q12 56 15 57 Q18 58 18 57 L16 44 Z" fill={dressColor} />
        <ellipse cx="14.5" cy="57" rx="5.5" ry="2" fill="#2c3e50" />
      </g>
      <g className="limb-left" style={{ transformOrigin: "25px 44px" }}>
        <path d="M27 44 Q28 56 25 57 Q22 58 22 57 L24 44 Z" fill={dressColor} />
        <ellipse cx="25.5" cy="57" rx="5.5" ry="2" fill="#2c3e50" />
      </g>

      {/* Dress (body) */}
      <path d="M11 29 Q9 45 11 50 Q15 54 20 54 Q25 54 29 50 Q31 45 29 29 Z" fill={hijabColor} opacity="0.85" />
      <rect x="11" y="26" width="18" height="20" rx="6" fill={hijabColor} opacity="0.9" />

      {/* Left arm */}
      <g className="limb-left" style={{ transformOrigin: "12px 29px" }}>
        <rect x="6" y="28" width="8" height="12" rx="4" fill={hijabColor} opacity="0.8" />
        <circle cx="10" cy="41" r="3" fill="#c8956b" />
      </g>

      {/* Right arm */}
      <g className="limb-right" style={{ transformOrigin: "28px 29px" }}>
        <rect x="26" y="28" width="8" height="12" rx="4" fill={hijabColor} opacity="0.8" />
        <circle cx="30" cy="41" r="3" fill="#c8956b" />
      </g>

      {/* Hijab body */}
      <ellipse cx="20" cy="22" rx="13" ry="12" fill={hijabColor} />
      <ellipse cx="20" cy="30" rx="12" ry="8" fill={hijabColor} />

      {/* Face */}
      <ellipse cx="20" cy="16" rx="9" ry="10" fill="#d4a574" />
      <ellipse cx="20" cy="18" rx="6.5" ry="6.5" fill="#c8956b" opacity="0.25" />

      {/* Hijab inner frame */}
      <path d="M11 14 Q11 6 20 6 Q29 6 29 14" fill={hijabColor} />
      <ellipse cx="20" cy="14" rx="9.5" ry="4" fill={hijabColor} opacity="0.5" />

      {/* Eyes */}
      <ellipse cx="16.5" cy="15" rx="2" ry="2.3" fill="white" />
      <ellipse cx="23.5" cy="15" rx="2" ry="2.3" fill="white" />
      <ellipse cx="16.5" cy="15.4" rx="1.2" ry="1.4" fill="#2c1a0e" />
      <ellipse cx="23.5" cy="15.4" rx="1.2" ry="1.4" fill="#2c1a0e" />
      <circle cx="17" cy="14.8" r="0.4" fill="white" />
      <circle cx="24" cy="14.8" r="0.4" fill="white" />

      {/* Smile */}
      <path d="M17.5 19 Q20 22.5 22.5 19" stroke="#8b5e3c" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Hijab highlight */}
      <path d="M12 12 Q14 8 20 7 Q26 8 28 12" stroke="white" strokeWidth="1" fill="none" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}
