export const LOMBA_KELUAR = [
  {
    id: "mewarnai",
    nama: "1. Lomba Mewarnai",
    kategoriUsia: "PAUD / TK",
    deskripsi:
      "Peserta mewarnai gambar yang disiapkan panitia menggunakan peralatan milik sendiri.",
    syarat: [
      "Peserta Kelas Paud atau TK",
      "Peserta Harus dikonfirmasi Oleh MT dan PJP Benar Kelas PAUD atau TK",
      "Peserta Harus Membawa Alat Sendiri",
      "Pendataan Peserta Terakhir Tanggal 20 September",
    ],
  },
  {
    id: "ranking-1",
    nama: "2. Lomba Ranking 1",
    kategoriUsia: "Semua Caberawit",
    deskripsi:
      "Lomba uji kecepatan dan kebenaran menjawab pertanyaan panitia secara eliminasi langsung.",
    syarat: [
      "Peserta semua Caberawit yg ingin Lomba",
      "Peserta menjawab Soal yg diberikan Oleh Panitia",
      "Peserta Menjawab dengan tangan kanan (A) Kiri (B)",
      "Soal Semakin lama Semakin Sulit",
      "Juara Diambil 1 Orang",
    ],
  },
];

export const LOMBA_KEDALAM = [
  {
    id: "pidato",
    nama: "1. Lomba Pidato",
    kategoriUsia: "Caberawit Putra",
    deskripsi:
      "Lomba menyampaikan pidato islami dengan tema 5 Bab (Nasehat Pokok) & Tri Sukses Generus.",
    syarat: [
      "TEMA: DIAWALI 5BAB (NASEHAT POKOK) KEMUDIAN TRISUKSES GENERUS",
      "Durasi pidato max 7 menit",
      "Peserta wajib Cowok",
      "Kategori penilaian: Performance (40%), Materi (40%), Ketepatan Waktu (20%)",
    ],
  },
  {
    id: "tahfidz",
    nama: "2. Lomba Tahfidz",
    kategoriUsia: "Semua Caberawit",
    deskripsi:
      "Lomba kelancaran hafalan Al-Qur'an (Surat An-Nas s/d At-Thoriq) dengan sistem undian 3 jenis surat.",
    syarat: [
      "Materi hafalan = Surat An Nas – At Thoriq",
      "Teknis ambil undian Surat saat hari H (3 surat: pendek, sedang, dan panjang)",
      "Kategori penilaian: Kekuatan hafalan (50%), Makhraj (25%), Tajwid (25%)",
    ],
  },
  {
    id: "tartil",
    nama: "3. Lomba Tartil",
    kategoriUsia: "Semua Caberawit",
    deskripsi:
      "Lomba membaca Al-Qur'an Juz 3 secara tartil, fasih, dan indah.",
    syarat: [
      "Materi Tartil Juz 3",
      "Kategori penilaian: Kelancaran (25%), Makhraj (25%), Tajwid (25%), Lagu (25%)",
    ],
  },
  {
    id: "adzan",
    nama: "4. Lomba Adzan",
    kategoriUsia: "Caberawit Putra",
    deskripsi:
      "Lomba keindahan lagu, makhraj, dan kelancaran lafadz adzan.",
    syarat: [
      "Kategori penilaian: Lagu (40%), Makhraj (20%), Penguasaan nafas (20%), Penampilan (20%)",
      "Jeda pada saat setelah syahadat termasuk penilaian penampilan",
    ],
  },
  {
    id: "cerdas-cermat",
    nama: "5. Lomba Cerdas Cermat",
    kategoriUsia: "Semua Caberawit",
    deskripsi:
      "Lomba menguji pemahaman agama, Al-Qur'an, tajwid, adab, dan karakter generus.",
    syarat: [
      "Kisi-kisi: Asmaul Husna, Do'a sehari-hari, Surat pendek An-Nas s/d At-Thoriq, 29 Karakter",
      "Tajwid, Tata Krama & akhlaq, Kemandirian, Praktik ibadah, Kefahaman agama",
      "Dalil2 (5 bab, 4 tali keimanan, Tri Sukses, 6 Thobiat Luhur) & Kisah Nabi-Nabi",
    ],
  },
];

export const DAFTAR_LOMBA = [...LOMBA_KELUAR, ...LOMBA_KEDALAM];
