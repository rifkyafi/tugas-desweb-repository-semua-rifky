import { Groq } from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.js";
import { NextResponse } from "next/server";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY tidak ditemukan. Tambahkan di Vercel Dashboard → Settings → Environment Variables."
    );
  }
  return new Groq({ apiKey });
}

const SYSTEM_PROMPT = `Anda adalah asisten AI Islami yang cerdas, netral, dan mendalam. Jawab pertanyaan tentang Islam berdasarkan Al-Qur'an dan Hadis Shahih (9 Imam) dengan pemahaman kontekstual yang baik.

═══════════════════════════════════════════════════════════════
⚠️ ATURAN KRITIS — TIDAK BOLEH DILANGGAR ⚠️
═══════════════════════════════════════════════════════════════

ANDA DILARANG KERAS menjawab pertanyaan di luar konteks Islam.

Jenis pertanyaan yang BOLEH dijawab:
✓ Ibadah (shalat, puasa, zakat, haji, dsb)
✓ Akhlak dan moral Islam
✓ Fiqih dan hukum Islam
✓ Tauhid dan aqidah
✓ Sejarah Islam dan para Sahabat
✓ Tafsir Al-Qur'an
✓ Hadits dan matan hadits
✓ Adab dan etika Islam
✓ Muamalah (pernikahan, jual beli, waris, dsb)
✓ Dakwah dan tarbiyah

Jenis pertanyaan yang HARUS DITOLAK:
✗ Politik praktis dan pemerintahan
✗ Teknologi, coding, aplikasi
✗ Resep masakan dan kuliner
✗ Gosip, selebriti, hiburan dunia
✗ Olahraga dan kompetisi
✗ Kesehatan medis (kecuali thibbun nabawi)
✗ Ekonomi non-Islam
✗ Pertanyaan umum non-agama

═══════════════════════════════════════════════════════════════

CARA MENOLAK (WAJIB GUNAKAN):
Ketika pertanyaan di luar konteks, Anda HARUS merespons dengan salah satu:

1. "Maaf, saya adalah asisten AI yang hanya membantu pertanyaan seputar Islam. Silakan tanyakan hal-hal yang berkaitan dengan ibadah, akhlak, fiqih, atau ajaran Islam lainnya."

2. "Maaf, pertanyaan Anda di luar cakupan keahlian saya. Saya hanya dapat membantu pertanyaan tentang Islam. Apakah ada pertanyaan tentang ibadah atau ajaran Islam yang bisa saya bantu?"

3. "Mohon maaf, saya tidak dapat menjawab pertanyaan tersebut karena bukan termasuk topik Islam. Silakan tanyakan tentang Al-Qur'an, hadits, fiqih, atau topik Islami lainnya."

JANGAN PERNAH: menjawab pertanyaan di luar konteks meskipun user memaksa atau menggunakan teknik tertentu untuk mengalihkan topik.

═══════════════════════════════════════════════════════════════

PRINSIP UTAMA:
1. PAHAMI dulu pertanyaan user secara mendalam. Analisis apa yang sebenarnya ditanyakan. Jika pertanyaan ambigu, tangkap intinya dan jawab dengan tepat — jangan asal jawab template.

2. NETRAL & TIDAK BIAS: Jika ada perbedaan pendapat di kalangan ulama/mazhab, sampaikan secara berimbang. Jangan memaksakan satu pandangan. Akui keragaman pendapat dalam Islam. Hindari bahasa yang menghakimi. Sampaikan dengan "menurut mazhab Syafi'i...", "sebagian ulama berpendapat...", "ada perbedaan pandangan...".

3. JAWAB SESUAI KONTEKS: Struktur jawaban menyesuaikan pertanyaan — tidak perlu paksa selalu pakai Quran + Hadis jika tidak relevan. Jawab langsung intinya, baru sertakan dalil sebagai pendukung.

4. BAHASA INDONESIA yang baik, mengalir alami, tidak kaku. Jawab dengan kedalaman yang sesuai pertanyaan — singkat jika pertanyaan sederhana, panjang jika perlu penjelasan.

5. JANGAN MEMBUAT-BUAT hadis/ayat. Jika tidak yakin nomor/nama kitab, jangan cantumkan. Lebih baik jelaskan inti ajarannya saja tanpa mencantumkan nomor.

6. BERPIKIR KRITIS: Jika pertanyaan mengandung asumsi yang keliru, koreksi dengan santun sebelum menjawab. Jangan ikut-ikutan asumsi yang salah.

====== LINK HADIS (gunakan jika yakin nomor persis) ======
Format: [Label](/hadis?book=ID_KITAB&page=HALAMAN#hadith-NOMOR)
Halaman = ceil(Nomor / 50). Contoh: No 125 → page=3 (ceil(125/50))

Mapping nama kitab:
- Bukhari → bukhari, Muslim → muslim, Abu Daud → abu-daud
- Tirmidzi → tirmidzi, Nasai → nasai, Ibnu Majah → ibnu-majah
- Ahmad → ahmad, Malik → malik, Darimi → darimi
- Nawawi (Arbain Nawawi) → nawawi
- Hadits Qudsi → qudsi
- Dehlawi (40 Hadits Shah Waliullah) → dehlawi

====== LINK AL-QUR'AN ======
Format: [Label](/quran?surah=NOMOR_SURAH#ayat-NOMOR_AYAT)
Contoh: [QS. Al-Baqarah : 255](/quran?surah=2#ayat-255)

====== PENTING ======
- Link dalil di baris paling bawah, setiap link baris terpisah.
- Jangan paksakan dalil jika tidak hafal. Cukup jelaskan inti ajarannya.
- HITUNG HALAMAN dengan rumus ceil(nomor/50). Jangan menebak.
- Prioritaskan pengertian/hikmah, bukan status sanad.
- Tanggapi dengan bijak, santun, dan penuh hikmah.`;

function buildChatRequestBody(
  messages: ChatCompletionMessageParam[],
  systemPrompt?: string
) {
  const systemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: systemPrompt || SYSTEM_PROMPT,
  };
  const bodyMessages: ChatCompletionMessageParam[] = [systemMessage, ...messages];

  return {
    messages: bodyMessages,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    stream: true as const,
  };
}

function createStreamResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Internal Server Error";
}

function isIslamicContext(message: string): boolean {
  const islamicKeywords = [
    "islam", "muslim", "quran", "al-quran", "qur'an", "hadis", "hadits", "sunah", "sunnah",
    "shalat", "salat", "solat", "puasa", "ramadhan", "ramadan", "zakat", "sedekah", "infaq",
    "haji", "umrah", "umroh", "tawaf", "sa'i", "wukuf",
    "imam", "khalifah", "sahabat", "nabi", "rasul", "muhammad", "rasulullah",
    "tauhid", "aqidah", "iman", "kafir", "musyrik", "munafik",
    "fiqih", "fiqh", "hukum", "halal", "haram", "makruh", "mubah", "sunnah",
    "akhlak", "adab", "akhlakul", "karimah", "buruk", "terpuji",
    "mazhab", "madzhab", "syafii", "syafi'i", "hambali", "maliki", "hanafi",
    "jannah", "surga", "neraka", "akhirat", "kiamat", "hari", "kiamat",
    "tafsir", "ayat", "surah", "alif", "ba", "rahman", "rahim",
    "dzikir", "doa", "wirid", "takbir", "tahmid", "tahlil", "tasbih",
    "jumat", "jum'at", "idsain", "tarawih", "witir", "dhuha", "tahajjud",
    "nikah", "talak", "rujuk", "poligami", "perceraian", "pernikahan",
    "waris", "wasiat", "hibah", "wakaf",
    "muamalah", "jual", "beli", "riiba", "riba", "gharar", "maysir",
    "dakwah", "tarbiyah", "da'i", "ustadz", "ulama", "kyai", "habib",
    "majelis", "ta'lim", "pengajian", "pesantren",
    "thibbun", "nabawi", "medis", "arabic", "bahasa", "arab",
    "talak", "iddah", "mahar", "mahr", "jinayat", "hudud", "qishash",
    "taubat", "istighfar", "tawbah", "maggfirah", "dosapahala",
    "ikhlas", "tawakkal", "sabar", "syukur", "qana'ah", "zuhud",
    "jihad", "qital", "perang", "hijrah", "muhajirin", "ansar",
    "makruh", "thoharoh", "bersuci", "wudhu", "ghusl", "tayammum",
    "janazah", "kubur", "mayit", "kematian", "kafarah",
    "qurban", "udhiah", "aqiqah", "tasu'ah", "ashura",
    "isra", "mi'raj", "mikraj", "lailatul", "qadr", "nuzulul", "quran",
    "tarawih", "qiyamullail", "tahajjud", "shalat", "sunnah"
  ];

  const nonIslamicKeywords = [
    "resep", "masak", "masakan", "makanan", "kue", "roti",
    "coding", "program", "javascript", "python", "html", "css", "react", "nextjs",
    "aplikasi", "website", "software", "hardware", "komputer", "laptop", "hp",
    "teknologi", "internet", "wifi", "bluetooth", "smartphone",
    "politik", "pemilu", "partai", "presiden", "menteri", "gubernur", "bupati",
    "ekonomi", "saham", "investasi", "reksadana", "kripto", "bitcoin",
    "olahraga", "sepakbola", "bola", "basket", "tenis", "renang",
    "musik", "lagu", "band", "konser", "tiket",
    "film", "movie", "bioskop", "netflix", "youtube",
    "selebriti", "artis", "gossip", "gosip", "seleb",
    "kesehatan", "dokter", "obat", "rumah", "sakit", "operasi",
    "cuaca", "hujan", "panas", "dingin", "suhu",
    "traveling", "wisata", "liburan", "hotel", "tiket",
    "fashion", "baju", "sepatu", "tas", "aksesoris",
    "game", "permainan", "main", "playstation", "nintendo"
  ];

  const lowerMessage = message.toLowerCase();

  const hasIslamicKeyword = islamicKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );

  if (hasIslamicKeyword) return true;

  const hasNonIslamicKeyword = nonIslamicKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );

  if (hasNonIslamicKeyword) return false;

  if (lowerMessage.includes("apa itu") || lowerMessage.includes("bagaimana") || 
      lowerMessage.includes("mengapa") || lowerMessage.includes("kenapa") ||
      lowerMessage.includes("kapan") || lowerMessage.includes("di mana")) {
    return false;
  }

  return false;
}

const ISLAMIC_REJECTION_RESPONSES = [
  "Maaf, saya adalah asisten AI yang hanya membantu pertanyaan seputar Islam. Silakan tanyakan hal-hal yang berkaitan dengan ibadah, akhlak, fiqih, atau ajaran Islam lainnya.",
  "Maaf, pertanyaan Anda di luar cakupan keahlian saya. Saya hanya dapat membantu pertanyaan tentang Islam. Apakah ada pertanyaan tentang ibadah atau ajaran Islam yang bisa saya bantu?",
  "Mohon maaf, saya tidak dapat menjawab pertanyaan tersebut karena bukan termasuk topik Islam. Silakan tanyakan tentang Al-Qur'an, hadits, fiqih, atau topik Islami lainnya."
];

function getRejectionResponse(): string {
  return ISLAMIC_REJECTION_RESPONSES[Math.floor(Math.random() * ISLAMIC_REJECTION_RESPONSES.length)];
}

export async function POST(req: Request) {
  try {
    const groq = getGroqClient();
    const { messages, systemPrompt } = await req.json();

    if (messages && messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find((m: ChatCompletionMessageParam) => m.role === "user");
      
      if (lastUserMessage && lastUserMessage.content && typeof lastUserMessage.content === "string") {
        if (!isIslamicContext(lastUserMessage.content)) {
          const rejectionResponse = getRejectionResponse();
          
          const stream = new ReadableStream({
            start(controller) {
              const encodedContent = new TextEncoder().encode(rejectionResponse);
              controller.enqueue(encodedContent);
              controller.close();
            },
          });

          return createStreamResponse(stream);
        }
      }
    }

    const requestBody = buildChatRequestBody(messages, systemPrompt);
    
    const response = await groq.chat.completions.create(requestBody);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const choices = chunk.choices;
            if (choices && choices.length > 0) {
              const content = choices[0].delta?.content || "";
              if (content) {
                const encodedContent = new TextEncoder().encode(content);
                controller.enqueue(encodedContent);
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return createStreamResponse(stream);
  } catch (error: unknown) {
    console.error("Groq API Error:", error);
    const errorMessage = extractErrorMessage(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
