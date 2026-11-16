export const themesData = [
  { id: 'akhlak', title: 'Akhlak & Karakter', desc: 'Adab, akhlak mulia, dan pembentukan karakter', book: 'bukhari', range: '1-3', quranRefs: [{ surah: 68, ayat: 4 }, { surah: 31, ayat: 18 }], keywords: ['Adab', 'Akhlak Mulia', 'Karakter'] },
  { id: 'keluarga', title: 'Keluarga', desc: 'Hak dan kewajiban dalam keluarga, parenting', book: 'muslim', range: '20-22', quranRefs: [{ surah: 4, ayat: 36 }, { surah: 2, ayat: 233 }], keywords: ['Orang Tua', 'Anak', 'Suami Istri'] },
  { id: 'ibadah', title: 'Ibadah', desc: 'Shalat, puasa, zakat, haji, dan ibadah lainnya', book: 'abu-daud', range: '400-403', quranRefs: [{ surah: 2, ayat: 43 }, { surah: 29, ayat: 45 }], keywords: ['Shalat', 'Puasa', 'Zakat'] },
  { id: 'ilmu', title: 'Ilmu & Pendidikan', desc: 'Keutamaan menuntut ilmu dan mengajarkannya', book: 'tirmidzi', range: '60-62', quranRefs: [{ surah: 96, ayat: 1 }, { surah: 20, ayat: 114 }], keywords: ['Ilmu', 'Mengajar', 'Ulama'] },
  { id: 'muamalah', title: 'Muamalah & Ekonomi', desc: 'Jual beli, utang piutang, kerja, dan rezeki', book: 'nasai', range: '200-202', quranRefs: [{ surah: 2, ayat: 275 }, { surah: 62, ayat: 10 }], keywords: ['Jual Beli', 'Rezeki', 'Amanah'] },
  { id: 'kesehatan', title: 'Kesehatan & Kebersihan', desc: 'Menjaga tubuh, kebersihan, dan pola makan', book: 'ibnu-majah', range: '30-32', quranRefs: [{ surah: 7, ayat: 31 }, { surah: 5, ayat: 6 }], keywords: ['Thaharah', 'Pola Makan', 'Kesehatan'] },
  { id: 'kepemimpinan', title: 'Kepemimpinan', desc: 'Tanggung jawab pemimpin, keadilan, dan amanah', book: 'ahmad', range: '50-52', quranRefs: [{ surah: 4, ayat: 58 }, { surah: 38, ayat: 26 }], keywords: ['Keadilan', 'Amanah', 'Pemimpin'] },
  { id: 'lingkungan', title: 'Lingkungan & Alam', desc: 'Menjaga bumi, tanaman, dan hewan', book: 'malik', range: '10-12', quranRefs: [{ surah: 7, ayat: 56 }, { surah: 55, ayat: 7 }], keywords: ['Tanaman', 'Hewan', 'Bumi'] },
  { id: 'doa-taubat', title: 'Doa & Taubat', desc: 'Adab berdoa, dzikir, dan pintu taubat', book: 'darimi', range: '60-62', quranRefs: [{ surah: 2, ayat: 186 }, { surah: 39, ayat: 53 }], keywords: ['Dzikir', 'Taubat', 'Doa'] },
  { id: 'persaudaraan', title: 'Persaudaraan & Sosial', desc: 'Ukhuwah, tolong-menolong, dan hak sesama', book: 'bukhari', range: '10-12', quranRefs: [{ surah: 49, ayat: 10 }, { surah: 5, ayat: 2 }], keywords: ['Ukhuwah', 'Tolong-menolong', 'Hak Sesama'] },
  { id: 'sabar', title: 'Sabar & Syukur', desc: 'Menghadapi ujian, bersyukur atas nikmat Allah', book: 'muslim', range: '70-72', quranRefs: [{ surah: 2, ayat: 155 }, { surah: 14, ayat: 7 }], keywords: ['Sabar', 'Syukur', 'Ujian'] },
  { id: 'kejujuran', title: 'Kejujuran & Amanah', desc: 'Menjaga lisan, jujur dalam ucapan dan perbuatan', book: 'tirmidzi', range: '100-102', quranRefs: [{ surah: 9, ayat: 119 }, { surah: 33, ayat: 70 }], keywords: ['Jujur', 'Amanah', 'Lisan'] },
  { id: 'tawadu', title: 'Tawadu & Sederhana', desc: 'Rendah hati, menghindari sombong dan berfoya-foya', book: 'abu-daud', range: '90-92', quranRefs: [{ surah: 25, ayat: 63 }, { surah: 17, ayat: 37 }], keywords: ['Tawadu', 'Rendah Hati', 'Sederhana'] },
  { id: 'jihad', title: 'Jihad & Perjuangan', desc: 'Sungguh-sungguh dalam beramal, berdakwah, dan menegakkan kebenaran', book: 'nasai', range: '50-52', quranRefs: [{ surah: 22, ayat: 78 }, { surah: 61, ayat: 11 }], keywords: ['Ijtihad', 'Dakwah', 'Kebenaran'] },
  { id: 'sedekah', title: 'Sedekah & Infak', desc: 'Keutamaan memberi, berbagi, dan menolong sesama', book: 'bukhari', range: '25-27', quranRefs: [{ surah: 2, ayat: 261 }, { surah: 3, ayat: 92 }], keywords: ['Sedekah', 'Infak', 'Zakat'] },
];

export const dalilKarakter = [
  { kategori: "3 Sukses", jumlah: 3, items: [
    { no: 1, karakter: "Alim & Faqih", book: 'bukhari', range: '1', quranRefs: [{ surah: 20, ayat: 114 }] },
    { no: 2, karakter: "Akhlaqul Kharimah", book: 'muslim', range: '2', quranRefs: [{ surah: 68, ayat: 4 }] },
    { no: 3, karakter: "Mandiri", book: 'abu-daud', range: '3', quranRefs: [{ surah: 53, ayat: 39 }] },
  ]},
  { kategori: "6 Thobiat Luhur", jumlah: 6, items: [
    { no: 4, karakter: "Rukun", book: 'tirmidzi', range: '4', quranRefs: [{ surah: 49, ayat: 10 }] },
    { no: 5, karakter: "Kompak", book: 'nasai', range: '5', quranRefs: [{ surah: 3, ayat: 103 }] },
    { no: 6, karakter: "Kerjasama yang baik", book: 'ibnu-majah', range: '6', quranRefs: [{ surah: 5, ayat: 2 }] },
    { no: 7, karakter: "Jujur", book: 'ahmad', range: '7', quranRefs: [{ surah: 9, ayat: 119 }] },
    { no: 8, karakter: "Amanah", book: 'malik', range: '8', quranRefs: [{ surah: 4, ayat: 58 }] },
    { no: 9, karakter: "Mujhid muzhid", book: 'darimi', range: '9', quranRefs: [{ surah: 29, ayat: 69 }] },
  ]},
  { kategori: "4 Tali Keimanan", jumlah: 4, items: [
    { no: 10, karakter: "Bersyukur", book: 'bukhari', range: '10', quranRefs: [{ surah: 14, ayat: 7 }] },
    { no: 11, karakter: "Mempersungguh", book: 'muslim', range: '11', quranRefs: [{ surah: 3, ayat: 200 }] },
    { no: 12, karakter: "Mengagungkan", book: 'abu-daud', range: '12', quranRefs: [{ surah: 22, ayat: 32 }] },
    { no: 13, karakter: "Berdo'a", book: 'tirmidzi', range: '13', quranRefs: [{ surah: 40, ayat: 60 }] },
  ]},
  { kategori: "3 Prinsip Kerja Sama", jumlah: 3, items: [
    { no: 14, karakter: "Benar", book: 'nasai', range: '14', quranRefs: [{ surah: 33, ayat: 70 }] },
    { no: 15, karakter: "Kurup", book: 'ibnu-majah', range: '15', quranRefs: [{ surah: 83, ayat: 1 }] },
    { no: 16, karakter: "Janji", book: 'ahmad', range: '16', quranRefs: [{ surah: 17, ayat: 34 }] },
  ]},
  { kategori: "4 Maqodirulloh", jumlah: 4, keterangan: "Bila diberi qodar", items: [
    { no: 17, karakter: "Nikmat, supaya bersyukur", book: 'malik', range: '17', quranRefs: [{ surah: 16, ayat: 114 }] },
    { no: 18, karakter: "Musibah, supaya istirja", book: 'darimi', range: '18', quranRefs: [{ surah: 2, ayat: 156 }] },
    { no: 19, karakter: "Qodar cobaan, supaya sabar", book: 'bukhari', range: '19', quranRefs: [{ surah: 2, ayat: 155 }] },
    { no: 20, karakter: "Qodar salah, supaya bertaubat", book: 'muslim', range: '20', quranRefs: [{ surah: 66, ayat: 8 }] },
  ]},
  { kategori: "4 Roda Berputar", jumlah: 4, items: [
    { no: 21, karakter: "Yang kuat, membantu yang lemah", book: 'abu-daud', range: '21', quranRefs: [{ surah: 5, ayat: 2 }] },
    { no: 22, karakter: "Yang bisa, membantu yang tidak bisa", book: 'tirmidzi', range: '22', quranRefs: [{ surah: 28, ayat: 77 }] },
    { no: 23, karakter: "Yang ingat, mengingatkan yang lupa", book: 'nasai', range: '23', quranRefs: [{ surah: 51, ayat: 55 }] },
    { no: 24, karakter: "Yang salah, dinasehati agar mau bertaubat", book: 'ibnu-majah', range: '24', quranRefs: [{ surah: 103, ayat: 3 }] },
  ]},
  { kategori: "5 Syarat Kerukunan & Kekompakan", jumlah: 5, items: [
    { no: 25, karakter: "Bicara yang Baik", book: 'ahmad', range: '25', quranRefs: [{ surah: 2, ayat: 83 }] },
    { no: 26, karakter: "Jujur, bisa dipercaya, & mempercayai", book: 'malik', range: '26', quranRefs: [{ surah: 33, ayat: 70 }] },
    { no: 27, karakter: "Sabar Keporo Ngalah", book: 'darimi', range: '27', quranRefs: [{ surah: 41, ayat: 34 }] },
    { no: 28, karakter: "Tidak merusak sesama (diri, harta, hak azasi dan kehormatan)", book: 'bukhari', range: '28', quranRefs: [{ surah: 4, ayat: 29 }] },
    { no: 29, karakter: "Saling memperhatikan dan menjaga perasaan", book: 'muslim', range: '29', quranRefs: [{ surah: 49, ayat: 11 }] },
  ]},
];

export const rukunData = [
  { kategori: "5 Rukun Islam", jumlah: 5, items: [
    { no: 1, karakter: "Syahadat", book: 'bukhari', range: '8', quranRefs: [{ surah: 3, ayat: 18 }] },
    { no: 2, karakter: "Shalat", book: 'bukhari', range: '8', quranRefs: [{ surah: 2, ayat: 43 }] },
    { no: 3, karakter: "Zakat", book: 'bukhari', range: '8', quranRefs: [{ surah: 2, ayat: 110 }] },
    { no: 4, karakter: "Puasa", book: 'bukhari', range: '8', quranRefs: [{ surah: 2, ayat: 183 }] },
    { no: 5, karakter: "Haji", book: 'bukhari', range: '8', quranRefs: [{ surah: 3, ayat: 97 }] },
  ]},
  { kategori: "6 Rukun Iman", jumlah: 6, items: [
    { no: 1, karakter: "Iman kepada Allah", book: 'muslim', range: '8', quranRefs: [{ surah: 2, ayat: 285 }] },
    { no: 2, karakter: "Iman kepada Malaikat", book: 'muslim', range: '8', quranRefs: [{ surah: 2, ayat: 285 }] },
    { no: 3, karakter: "Iman kepada Kitab", book: 'muslim', range: '8', quranRefs: [{ surah: 2, ayat: 285 }] },
    { no: 4, karakter: "Iman kepada Rasul", book: 'muslim', range: '8', quranRefs: [{ surah: 4, ayat: 136 }] },
    { no: 5, karakter: "Iman kepada Hari Kiamat", book: 'muslim', range: '8', quranRefs: [{ surah: 4, ayat: 136 }] },
    { no: 6, karakter: "Iman kepada Qada & Qadar", book: 'muslim', range: '8', quranRefs: [{ surah: 54, ayat: 49 }] },
  ]},
];
