export interface KeyVerse {
  surahNomor: number;
  surahName: string;
  ayatNomor: number;
  arab: string;
  translation: string;
  keywords: string[];
}

export const CONTEXT_SYNONYMS: Record<string, string[]> = {
  "shalat": ["shalat", "sholat", "sembahyang", "sujud", "salat", "rukuk", "ibadah"],
  "sholat": ["shalat", "sholat", "sembahyang", "sujud", "salat", "rukuk", "ibadah"],
  "puasa": ["puasa", "shaum", "saum", "ramadhan", "ramadan", "lapar", "ibadah"],
  "shaum": ["puasa", "shaum", "saum", "ramadhan", "ramadan"],
  "sedekah": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "dermawan", "berbagi", "harta"],
  "infak": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "berbagi", "harta"],
  "infaq": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "berbagi", "harta"],
  "zakat": ["sedekah", "infak", "infaq", "zakat", "shodaqoh", "harta", "fitrah"],
  "kiamat": ["kiamat", "akhirat", "hari akhir", "mahsyar", "kebangkitan", "terompet", "mati", "kematian"],
  "neraka": ["neraka", "jahanam", "siksa", "api", "adab", "dosa"],
  "surga": ["surga", "jannah", "nikmat", "pahala", "kekal", "taman"],
  "orang tua": ["orang tua", "ibu", "bapak", "ayah", "walidain", "berbakti"],
  "ibu": ["orang tua", "ibu", "bapak", "ayah", "walidain", "melahirkan"],
  "ayah": ["orang tua", "ibu", "bapak", "ayah", "walidain"],
  "bapak": ["orang tua", "ibu", "bapak", "ayah", "walidain"],
  "taubat": ["taubat", "ampunan", "istighfar", "tobat", "maaf", "sesal", "ampun"],
  "tobat": ["taubat", "ampunan", "istighfar", "tobat", "maaf", "sesal", "ampun"],
  "ilmu": ["ilmu", "belajar", "membaca", "pengetahuan", "paham", "pengajaran", "ulama"],
  "belajar": ["ilmu", "belajar", "membaca", "pengetahuan", "paham"],
  "nikah": ["nikah", "kawin", "pernikahan", "suami", "istri", "keluarga", "jodoh", "pasangan"],
  "sabar": ["sabar", "tabah", "sabr", "cobaan", "ujian", "musibah"],
  "syukur": ["syukur", "terima kasih", "nikmat", "puji", "bersyukur"],
  "jujur": ["jujur", "benar", "amanah", "dusta", "bohong", "lisan", "ucapan"],
  "syirik": ["syirik", "menyekutukan", "tauhid", "esa", "tuhan"],
  "wudhu": ["wudhu", "bersuci", "thaharah", "suci", "air", "bersihkan"],
  "hijrah": ["hijrah", "pindah", "bersungguh-sungguh"],
  "jihad": ["jihad", "perjuangan", "dakwah", "kebenaran", "sungguh"],
  "quran": ["quran", "kitab", "bacaan", "kalam", "wahyu"],
  "doa": ["doa", "memohon", "meminta", "dzikir", "wirid"]
};

export const KEY_VERSES: KeyVerse[] = [
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 43,
    arab: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    translation: "Dan laksanakanlah salat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.",
    keywords: ["shalat", "sholat", "zakat", "rukuk", "ibadah"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 153,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    keywords: ["sabar", "shalat", "sholat", "sabr", "tabah", "ibadah", "penolong"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 155,
    arab: "وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    translation: "Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar.",
    keywords: ["sabar", "ujian", "cobaan", "takut", "kelaparan", "harta", "jiwa", "musibah"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 183,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    translation: "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.",
    keywords: ["puasa", "shaum", "saum", "ramadhan", "ramadan", "wajib", "takwa"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 186,
    arab: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku.",
    keywords: ["doa", "memohon", "meminta", "kabul", "dekat", "hamba"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 261,
    arab: "مَثَلُ الَّذِينَ يُنْفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ",
    translation: "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji.",
    keywords: ["sedekah", "infak", "infaq", "harta", "pemberian", "pahala", "kebaikan"]
  },
  {
    surahNomor: 2,
    surahName: "Al-Baqarah",
    ayatNomor: 275,
    arab: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
    translation: "Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.",
    keywords: ["riba", "jual beli", "dagang", "usaha", "muamalah", "halal", "haram"]
  },
  {
    surahNomor: 3,
    surahName: "Ali 'Imran",
    ayatNomor: 18,
    arab: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ",
    translation: "Allah menyatakan bahwa tidak ada tuhan selain Dia; (demikian pula) para malaikat dan orang-orang berilmu yang menegakkan keadilan.",
    keywords: ["syahadat", "tauhid", "esa", "tuhan", "ilmu", "keadilan", "iman"]
  },
  {
    surahNomor: 3,
    surahName: "Ali 'Imran",
    ayatNomor: 103,
    arab: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا",
    translation: "Dan berpegangteguhlah kamu semuanya pada tali (agama) Allah, dan janganlah kamu bercerai berai.",
    keywords: ["kompak", "bersatu", "ukhuwah", "persaudaraan", "bercerai berai", "tali allah"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 29,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ إِلَّا أَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ",
    translation: "Wahai orang-orang yang beriman! Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil (tidak benar), kecuali dalam perdagangan atas dasar suka sama suka di antara kamu.",
    keywords: ["harta", "dagang", "perdagangan", "jual beli", "batil", "muamalah"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 36,
    arab: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ",
    translation: "Dan sembahlah Allah dan janganlah kamu mempersekutukan-Nya dengan sesuatu apa pun. Dan berbuat baiklah kepada kedua orang tua, karib kerabat, anak-anak yatim, dan orang-orang miskin.",
    keywords: ["orang tua", "ibu", "ayah", "anak yatim", "miskin", "kerabat", "syirik", "tauhid", "berbuat baik", "walidain"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 58,
    arab: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُمْ بَيْنَ النَّاسِ أَنْ تَحَكُمُوا بِالْعَدْلِ",
    translation: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkannya dengan adil.",
    keywords: ["amanah", "adil", "hukum", "pemimpin", "kepemimpinan", "tanggung jawab"]
  },
  {
    surahNomor: 4,
    surahName: "An-Nisa'",
    ayatNomor: 136,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا آمِنُوا بِاللَّهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلَىٰ رَسُولِهِ",
    translation: "Wahai orang-orang yang beriman! Tetaplah beriman kepada Allah dan Rasul-Nya dan kepada Kitab (Al-Qur'an) yang diturunkan kepada Rasul-Nya.",
    keywords: ["iman", "kitab", "rasul", "malaikat", "kiamat", "percaya"]
  },
  {
    surahNomor: 5,
    surahName: "Al-Ma'idah",
    ayatNomor: 2,
    arab: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ",
    translation: "Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.",
    keywords: ["tolong-menolong", "kerjasama", "kebajikan", "takwa", "dosa", "permusuhan"]
  },
  {
    surahNomor: 5,
    surahName: "Al-Ma'idah",
    ayatNomor: 6,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
    translation: "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan salat, maka basuhlah wajahmu dan tanganmu sampai ke siku, dan sapulah kepalamu dan (basuh) kedua kakimu sampai kedua mata kaki.",
    keywords: ["wudhu", "bersuci", "suci", "air", "thaharah", "shalat", "sholat"]
  },
  {
    surahNomor: 17,
    surahName: "Al-Isra'",
    ayatNomor: 23,
    arab: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُلْ لَهُمَا أُفٍّ",
    translation: "Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapakmu. Jika salah seorang di antara keduanya atau kedua-duanya sampai berusia lanjut dalam pemeliharaanmu, maka sekali-kali janganlah engkau mengatakan kepada keduanya perkataan 'ah'.",
    keywords: ["orang tua", "ibu", "ayah", "berbakti", "walidain", "bapak", "akhlak"]
  },
  {
    surahNomor: 17,
    surahName: "Al-Isra'",
    ayatNomor: 34,
    arab: "وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا",
    translation: "Dan penuhilah janji, karena janji itu pasti diminta pertanggungjawabannya.",
    keywords: ["janji", "amanah", "jujur", "akhlak", "luhur"]
  },
  {
    surahNomor: 20,
    surahName: "Taha",
    ayatNomor: 114,
    arab: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    translation: "Dan katakanlah, 'Ya Tuhanku, tambahkanlah ilmu kepadaku.'",
    keywords: ["ilmu", "belajar", "membaca", "doa", "pengetahuan"]
  },
  {
    surahNomor: 30,
    surahName: "Ar-Rum",
    ayatNomor: 21,
    arab: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
    translation: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    keywords: ["nikah", "pernikahan", "keluarga", "jodoh", "suami", "istri", "kasih sayang", "cinta"]
  },
  {
    surahNomor: 31,
    surahName: "Luqman",
    ayatNomor: 17,
    arab: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ",
    translation: "Wahai anakku! Laksanakanlah salat dan suruhlah (manusia) berbuat yang makruf dan cegahlah (mereka) dari yang mungkar dan bersabarlah terhadap apa yang menimpamu.",
    keywords: ["shalat", "sholat", "sabar", "makruf", "mungkar", "nasehat", "anak", "orang tua"]
  },
  {
    surahNomor: 39,
    surahName: "Az-Zumar",
    ayatNomor: 53,
    arab: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.'",
    keywords: ["taubat", "tobat", "ampunan", "dosa", "rahmat", "putus asa"]
  },
  {
    surahNomor: 49,
    surahName: "Al-Hujurat",
    ayatNomor: 10,
    arab: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
    translation: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu yang berselisih.",
    keywords: ["ukhuwah", "persaudaraan", "damai", "mukmin", "saudara"]
  },
  {
    surahNomor: 49,
    surahName: "Al-Hujurat",
    ayatNomor: 11,
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسَىٰ أَنْ يَكُونُوا خَيْرًا مِنْهُمْ",
    translation: "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diperolok-olokkan) lebih baik dari mereka.",
    keywords: ["lisan", "olok-olok", "perasaan", "ghibah", "gosip", "akhlak", "menjaga perasaan"]
  },
  {
    surahNomor: 58,
    surahName: "Al-Mujadilah",
    ayatNomor: 11,
    arab: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    translation: "Niscaya Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat.",
    keywords: ["ilmu", "belajar", "derajat", "iman", "pendidikan"]
  },
  {
    surahNomor: 68,
    surahName: "Al-Qalam",
    ayatNomor: 4,
    arab: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
    translation: "Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung.",
    keywords: ["akhlak", "mulia", "karakter", "budi pekerti", "rasul"]
  },
  {
    surahNomor: 96,
    surahName: "Al-'Alaq",
    ayatNomor: 1,
    arab: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translation: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.",
    keywords: ["membaca", "belajar", "ilmu", "wahyu", "pengetahuan"]
  },
  {
    surahNomor: 103,
    surahName: "Al-'Asr",
    ayatNomor: 1,
    arab: "وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ * إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.",
    keywords: ["sabar", "waktu", "benar", "nasehat", "iman", "amal saleh"]
  }
];
