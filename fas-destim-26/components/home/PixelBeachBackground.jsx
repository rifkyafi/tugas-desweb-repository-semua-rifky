
const BINTANG = [
  { atas: "6%", kiri: "12%", delay: "0s", durasi: "2.4s" },
  { atas: "14%", kiri: "30%", delay: "0.6s", durasi: "3.2s" },
  { atas: "4%", kiri: "45%", delay: "1.1s", durasi: "2.8s" },
  { atas: "10%", kiri: "58%", delay: "0.2s", durasi: "2.2s" },
  { atas: "18%", kiri: "74%", delay: "0.9s", durasi: "3.6s" },
  { atas: "5%", kiri: "86%", delay: "1.4s", durasi: "2.6s" },
  { atas: "26%", kiri: "8%", delay: "0.4s", durasi: "3s" },
  { atas: "30%", kiri: "38%", delay: "1.6s", durasi: "2.4s" },
  { atas: "24%", kiri: "66%", delay: "0.7s", durasi: "3.4s" },
  { atas: "12%", kiri: "20%", delay: "1.2s", durasi: "2s" },
  { atas: "20%", kiri: "52%", delay: "0.3s", durasi: "3.8s" },
  { atas: "8%", kiri: "70%", delay: "1.8s", durasi: "2.8s" },
];


export default function PixelBeachBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#34AFEC] dark:bg-[#0d1f45]" aria-hidden="true">
      {/* Bintang (hanya tampil malam) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100">
        {BINTANG.map((bintang, i) => (
          <div
            key={i}
            className="star-twinkle absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: bintang.atas,
              left: bintang.kiri,
              animationDelay: bintang.delay,
              animationDuration: bintang.durasi,
            }}
          />
        ))}
      </div>

      {/* Matahari */}
      <div className="sky-object sky-sun right-[10%] top-[10%]">
        <div className="sun-glow relative h-14 w-14 rounded-full bg-sun"></div>
      </div>

      {/* Bulan purnama */}
      <div className="sky-object sky-moon right-[10%] top-[10%]">
        <div className="moon-glow relative h-14 w-14 rounded-full bg-[#f5f0d8]">
          <div className="absolute left-2 top-3 h-3 w-3 rounded-full bg-[#d8d2b0]" />
          <div className="absolute right-2 top-8 h-2 w-2 rounded-full bg-[#d8d2b0]" />
          <div className="absolute left-4 top-10 h-2 w-2 rounded-full bg-[#d8d2b0]" />
        </div>
      </div>

      {/* Clouds */}
      <Cloud top="10%" scale="scale-125" durasi="95s" delay="0s" variant={1} />
      <Cloud top="24%" scale="scale-150" durasi="120s" delay="-50s" variant={2} />
      <Cloud top="38%" scale="scale-90 opacity-75" durasi="140s" delay="-90s" variant={1} />

      {/* Ocean — smooth 2D */}
      <OceanLayer />

      {/* Sand */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[#f5d5a2] dark:bg-[#2e2a44]">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#ebd0a3] dark:bg-[#3a3556]" />

        {/* Smooth dunes */}
        <svg
          className="absolute top-0 inset-x-0 w-full overflow-visible dark:opacity-60"
          style={{ marginTop: "-18px" }}
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 24 Q150 4 300 18 Q450 30 600 14 Q750 2 900 18 Q1050 30 1200 12 L1200 24 Z"
            className="fill-[#ebd0a3] dark:fill-[#3a3556]"
          />
          <path
            d="M0 24 Q150 10 300 22 Q450 32 600 18 Q750 8 900 22 Q1050 32 1200 16 L1200 24 Z"
            className="fill-[#f5d5a2] dark:fill-[#2e2a44]"
          />
        </svg>

        {/* Foam line */}
        <div className="absolute top-[-2px] inset-x-0 h-[2px] bg-white opacity-50 dark:bg-[#8a86a8] dark:opacity-30 rounded-full" />

        {/* Sand texture dots */}
        <div className="absolute top-[20%] left-[15%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
        <div className="absolute top-[50%] left-[5%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
        <div className="absolute top-[30%] left-[45%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
        <div className="absolute top-[60%] left-[35%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
        <div className="absolute top-[40%] left-[75%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
        <div className="absolute top-[70%] left-[85%] h-1 w-1 rounded-full bg-[#e0b87c] dark:bg-[#4a4368]" />
      </div>

      {/* Palm Trees */}
      <PixelPalmTree className="bottom-[22%] left-[2%] scale-[1.55]" lean="right" />
      <PixelPalmTree className="bottom-[22%] left-[18%] scale-[1.3]" lean="straight" />
      <PixelPalmTree className="bottom-[22%] left-[10%] scale-[1.0]" lean="straight" />
      <PixelPalmTree className="bottom-[22%] right-[5%] scale-[1.45]" lean="left" />
    </div>
  );
}

/* ── Ocean Layer (2D smooth) ──────────────────────────── */
function OceanLayer() {
  return (
    <div className="absolute inset-x-0 top-[62%] bottom-[22%] overflow-hidden">
      {/* Ocean body */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e9fd4] to-[#0f6fa0] dark:from-[#0d3a72] dark:to-[#071e45]" />

      {/* Surface shimmer highlight */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#6dd5fb] dark:bg-[#3a7ec4] opacity-70 rounded-full" />

      {/* Wave 1 — foreground, faster (seamless loop) */}
      <svg
        className="wave-svg-1 absolute top-[-18px] inset-x-0 w-[200%] overflow-visible"
        viewBox="0 0 2880 36"
        preserveAspectRatio="none"
        fill="none"
        style={{ height: "36px" }}
      >
        <path
          d="M0 20 C120 8 240 28 360 18 C480 8 600 28 720 18 C840 8 960 28 1080 18 C1200 8 1320 28 1440 18 C1560 8 1680 28 1800 18 C1920 8 2040 28 2160 18 C2280 8 2400 28 2520 18 C2640 8 2760 28 2880 18 L2880 36 L0 36 Z"
          className="fill-[#2eb8f0] dark:fill-[#1a5499]"
          opacity="0.9"
        />
      </svg>

      {/* Wave 2 — mid, slower (seamless loop) */}
      <svg
        className="wave-svg-2 absolute top-[-10px] inset-x-0 w-[200%] overflow-visible"
        viewBox="0 0 2880 28"
        preserveAspectRatio="none"
        fill="none"
        style={{ height: "28px" }}
      >
        <path
          d="M0 16 C180 6 360 24 540 14 C720 4 900 24 1080 14 C1260 4 1440 20 1440 14 C1620 4 1800 24 1980 14 C2160 4 2340 24 2520 14 C2700 4 2880 20 2880 14 L2880 28 L0 28 Z"
          className="fill-[#1ba8e0] dark:fill-[#163d6e]"
          opacity="0.7"
        />
      </svg>

      {/* Foam flecks — gentle CSS, no JS */}
      <div className="absolute top-[12%] inset-x-0 overflow-hidden opacity-30 dark:opacity-15">
        <svg viewBox="0 0 2400 4" preserveAspectRatio="none" className="wave-foam-1 w-[200%]" style={{ height: "4px" }}>
          <path d="M0 2 C80 0 160 4 240 2 C320 0 400 4 480 2 C560 0 640 4 720 2 C800 0 880 4 960 2 C1040 0 1120 4 1200 2 C1280 0 1360 4 1440 2 C1520 0 1600 4 1680 2 C1760 0 1840 4 1920 2 C2000 0 2080 4 2160 2 C2240 0 2320 4 2400 2"
            stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-[38%] inset-x-0 overflow-hidden opacity-20 dark:opacity-10">
        <svg viewBox="0 0 2400 4" preserveAspectRatio="none" className="wave-foam-2 w-[200%]" style={{ height: "4px" }}>
          <path d="M0 2 C100 0 200 4 300 2 C400 0 500 4 600 2 C700 0 800 4 900 2 C1000 0 1100 4 1200 2 C1300 0 1400 4 1500 2 C1600 0 1700 4 1800 2 C1900 0 2000 4 2100 2 C2200 0 2300 4 2400 2"
            stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-[68%] inset-x-0 overflow-hidden" style={{ opacity: 0.15 }}>
        <svg viewBox="0 0 2400 4" preserveAspectRatio="none" className="wave-foam-1 w-[200%]" style={{ height: "4px" }}>
          <path d="M0 2 C90 0 180 4 270 2 C360 0 450 4 540 2 C630 0 720 4 810 2 C900 0 990 4 1080 2 C1170 0 1260 4 1350 2 C1440 0 1530 4 1620 2 C1710 0 1800 4 1890 2 C1980 0 2070 4 2160 2 C2250 0 2340 4 2400 2"
            stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Ships */}
      <PixelShip top="-4%" scale="scale-50 opacity-70" durasi="120s" delay="-20s" direction="left" />
      <PixelShip top="4%" scale="scale-75 opacity-90" durasi="95s" delay="-50s" direction="right" />
      <PixelShip top="15%" scale="scale-90" durasi="80s" delay="-10s" direction="left" />
    </div>
  );
}


/* ── Cloud ───────────────────────────────────────────── */
function Cloud({ top, scale, durasi, delay, variant = 1 }) {
  return (
    <div
      className="absolute inset-x-0 cloud-drift opacity-85 pointer-events-none"
      style={{ top, animationDuration: durasi, animationDelay: delay }}
    >
      <div className={`relative ${scale} w-48 h-14`}>
        {variant === 1 ? (
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-2 w-44 h-8 bg-white/90 dark:bg-[#46527a] rounded-full shadow-sm" />
            <div className="absolute bottom-1 left-4 w-10 h-10 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-2 left-10 w-14 h-14 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-2 left-20 w-12 h-12 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-1 left-28 w-9 h-9 bg-white/90 dark:bg-[#46527a] rounded-full" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute bottom-0 left-4 w-38 h-7 bg-white/90 dark:bg-[#46527a] rounded-full shadow-sm" />
            <div className="absolute bottom-1 left-6 w-9 h-9 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-2 left-12 w-12 h-12 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-2 left-20 w-10 h-10 bg-white/90 dark:bg-[#46527a] rounded-full" />
            <div className="absolute bottom-1 left-26 w-8 h-8 bg-white/90 dark:bg-[#46527a] rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Ship ────────────────────────────────────────────── */
function PixelShip({ top, scale = "scale-100", durasi, delay, direction = "left" }) {
  const isRight = direction === "right";
  const sailClass = isRight ? "ship-sail-reverse" : "ship-sail";

  return (
    <div
      className={`absolute inset-x-0 ${sailClass}`}
      style={{ top, animationDuration: durasi, animationDelay: delay }}
    >
      <div className={`relative ship-bob w-32 h-24 origin-bottom ${scale}`}>
        <div className={`absolute inset-0 ${isRight ? "-scale-x-100" : ""}`}>
          <svg viewBox="0 0 128 96" className="w-full h-full drop-shadow-sm" fill="none">
            <rect x="62" y="14" width="4" height="60" rx="1" className="fill-[#4a2f1d] dark:fill-[#241409]" />
            <path d="M 62 14 L 48 19 L 62 24 Z" className="fill-[#e53e3e]" />
            <path d="M 66 18 C 98 32 94 60 66 70 Z" className="fill-white dark:fill-[#9aa3bd]" />
            <path d="M 60 24 C 34 40 38 62 60 68 Z" className="fill-white/95 dark:fill-[#8a93ad]" />
            <path d="M 22 72 L 34 88 H 94 L 106 72 Z" className="fill-[#8d5524] dark:fill-[#3d2612]" />
            <path d="M 22 72 L 26 77 H 102 L 106 72 Z" className="fill-[#a66a33] dark:fill-[#4c3018]" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Palm Tree ───────────────────────────────────────── */
const q = (n) => Math.round(n / 2) * 2;
const APEX_Y = 44;

const TRUNK_EDGES = {
  straight: {
    left: [[64, 180], [64, 130], [66, 80], [66, APEX_Y]],
    right: [[76, 180], [76, 130], [74, 80], [74, APEX_Y]],
  },
  right: {
    left: [[64, 180], [74, 130], [82, 80], [88, APEX_Y]],
    right: [[76, 180], [84, 130], [90, 80], [96, APEX_Y]],
  },
};

const FRONDS_STRAIGHT = [
  [-160, 56, 30], [-138, 60, 56], [-112, 54, 66], [-90, 40, 34],
  [-68, 54, 64], [-42, 60, 54], [-20, 52, 26],
];

const FRONDS_RIGHT = [
  [-160, 56, 30], [-138, 60, 56], [-112, 54, 66], [-90, 40, 34],
  [-68, 54, 64], [-42, 60, 54], [-20, 52, 26], [2, 46, 22],
];

function cubicPoint(p0, c1, c2, p1, t) {
  const u = 1 - t;
  return [
    q(u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0]),
    q(u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1]),
  ];
}

function frondParts(crown, angleDeg, len, droop, wBase) {
  const rad = (angleDeg * Math.PI) / 180;
  const dir = [Math.cos(rad), Math.sin(rad)];
  let perp = [-dir[1], dir[0]];
  if (perp[1] < 0) perp = [-perp[0], -perp[1]];

  const tip = [q(crown[0] + dir[0] * len), q(crown[1] + dir[1] * len + droop)];
  const c1 = [q(crown[0] + (dir[0] * len) / 3), q(crown[1] + (dir[1] * len) / 3 + droop / 9)];
  const c2 = [q(crown[0] + (dir[0] * len * 2) / 3), q(crown[1] + (dir[1] * len * 2) / 3 + (droop * 4) / 9)];
  const w = (t) => wBase * (1 - 0.85 * t);

  const o1L = [q(c1[0] + perp[0] * w(1 / 3) * 1.1), q(c1[1] + perp[1] * w(1 / 3) * 1.1)];
  const o2L = [q(c2[0] + perp[0] * w(2 / 3) * 1.1), q(c2[1] + perp[1] * w(2 / 3) * 1.1)];
  const o1U = [q(c1[0] - perp[0] * w(1 / 3) * 0.9), q(c1[1] - perp[1] * w(1 / 3) * 0.9)];
  const o2U = [q(c2[0] - perp[0] * w(2 / 3) * 0.9), q(c2[1] - perp[1] * w(2 / 3) * 0.9)];

  const blade = `M ${crown[0]} ${crown[1]} C ${o1L[0]} ${o1L[1]} ${o2L[0]} ${o2L[1]} ${tip[0]} ${tip[1]} C ${o2U[0]} ${o2U[1]} ${o1U[0]} ${o1U[1]} ${crown[0]} ${crown[1]} Z`;
  const spine = `M ${crown[0]} ${crown[1]} C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${tip[0]} ${tip[1]}`;

  const leaflets = [];
  for (const t of [0.5, 0.67, 0.84, 0.97]) {
    const p = cubicPoint(crown, c1, c2, tip, t);
    const wt = w(t);
    const base = [q(p[0] + perp[0] * wt), q(p[1] + perp[1] * wt)];
    const llen = 8 * (1.4 - t);
    const ld = [perp[0] * 0.7 + dir[0] * 0.55, perp[1] * 0.7 + dir[1] * 0.55 + 0.35];
    const ll = Math.hypot(ld[0], ld[1]);
    leaflets.push(`M ${base[0]} ${base[1]} L ${q(base[0] + (ld[0] / ll) * llen)} ${q(base[1] + (ld[1] / ll) * llen)}`);
  }
  return { blade, spine, leaflets, tip };
}

function PixelPalmTree({ className, lean }) {
  const key = lean === "straight" ? "straight" : "right";
  const apexX = key === "straight" ? 70 : 92;
  const crown = [apexX, APEX_Y + 2];
  const edges = TRUNK_EDGES[key];
  const { left, right } = edges;
  const fronds = key === "straight" ? FRONDS_STRAIGHT : FRONDS_RIGHT;

  const trunkPath = `M ${left[0][0]} ${left[0][1]} C ${left[1][0]} ${left[1][1]} ${left[2][0]} ${left[2][1]} ${left[3][0]} ${left[3][1]} C ${right[2][0]} ${right[2][1]} ${right[1][0]} ${right[1][1]} ${right[0][0]} ${right[0][1]} Z`;

  const rings = [];
  for (let t = 0.08; t <= 0.85; t += 0.11) {
    const L = cubicPoint(left[0], left[1], left[2], left[3], t);
    const R = cubicPoint(right[0], right[1], right[2], right[3], t);
    const m = [q((L[0] + R[0]) / 2), q((L[1] + R[1]) / 2)];
    rings.push(`M ${L[0]} ${L[1]} Q ${m[0]} ${m[1] + 4} ${R[0]} ${R[1]}`);
  }

  const prepared = fronds.map(([a, l, d], i) => ({
    ...frondParts(crown, a, l, d, (8 * l) / 60),
    id: `palm-${key}-${i}`,
    isUp: a >= -100 && a <= -80,
  }));

  return (
    <div className={`absolute ${className} palm-sway dark:brightness-[0.45] dark:saturate-[0.55]`}>
      <div className={lean === "left" ? "-scale-x-100" : undefined}>
        <svg width={150} height={180} viewBox="0 0 150 180" fill="none">
          <defs>
            <linearGradient id={`trunk-${key}`} gradientUnits="userSpaceOnUse" x1={50} y1={0} x2={105} y2={0}>
              <stop offset="0" stopColor="#7c4a26" />
              <stop offset="0.3" stopColor="#a67c52" />
              <stop offset="0.65" stopColor="#c9a06e" />
              <stop offset="1" stopColor="#ddb98b" />
            </linearGradient>
            {prepared.map((f) => (
              <linearGradient key={f.id} id={f.id} gradientUnits="userSpaceOnUse" x1={crown[0]} y1={crown[1]} x2={f.tip[0]} y2={f.tip[1]}>
                <stop offset="0" stopColor={f.isUp ? "#7ad35f" : "#63c457"} />
                <stop offset="0.45" stopColor="#459e3d" />
                <stop offset="1" stopColor="#2e7d32" />
              </linearGradient>
            ))}
          </defs>

          <path d={trunkPath} fill={`url(#trunk-${key})`} />
          {rings.map((d, i) => (
            <path key={i} d={d} stroke="#7a4a2b" strokeWidth={2} opacity={0.5} fill="none" />
          ))}

          <ellipse className="dark:opacity-0" cx={70} cy={178} rx={22} ry={6} fill="#ebd0a3" />
          <ellipse className="dark:opacity-0" cx={70} cy={176} rx={16} ry={4} fill="#f5d5a2" />
          <ellipse cx={crown[0]} cy={crown[1] + 8} rx={30} ry={14} fill="#1f5e21" opacity={0.25} />
          <ellipse cx={crown[0] - 6} cy={crown[1] + 8} rx={4} ry={4} fill="#6b4423" stroke="#4c2f15" strokeWidth={1} />
          <ellipse cx={crown[0] + 4} cy={crown[1] + 10} rx={4} ry={4} fill="#6b4423" stroke="#4c2f15" strokeWidth={1} />
          <ellipse cx={crown[0] + 2} cy={crown[1] + 6} rx={4} ry={4} fill="#5c3a1e" />
          <ellipse cx={crown[0] - 6} cy={crown[1] + 8} rx={2} ry={2} fill="#8a6238" />

          {prepared.map((f) => (
            <g key={f.id}>
              <path d={f.blade} fill={`url(#${f.id})`} />
              <path d={f.spine} stroke="#256129" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
              {!f.isUp && f.leaflets.map((d, j) => (
                <path key={j} d={d} stroke="#2b6b2c" strokeWidth={2} strokeLinecap="round" />
              ))}
            </g>
          ))}

          <path d={`M ${crown[0]} ${crown[1] + 2} Q ${crown[0] - 12} ${crown[1] - 20} ${crown[0] - 8} ${crown[1] - 34}`} stroke="#7ed957" strokeWidth={6} strokeLinecap="round" />
          <path d={`M ${crown[0]} ${crown[1] + 2} Q ${crown[0]} ${crown[1] - 26} ${crown[0]} ${crown[1] - 40}`} stroke="#7ed957" strokeWidth={6} strokeLinecap="round" />
          <path d={`M ${crown[0]} ${crown[1] + 2} Q ${crown[0] + 12} ${crown[1] - 20} ${crown[0] + 8} ${crown[1] - 34}`} stroke="#7ed957" strokeWidth={6} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
