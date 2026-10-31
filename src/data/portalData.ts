export interface Siswa9C {
  id: number;
  nama: string;
  nisn?: string;
  gender: 'L' | 'P';
  jabatan?: string;
}

export const DAFTAR_SISWA_9C: string[] = [
  "Alika Azahra Putri",
  "Andi Hermawan",
  "Cep Irawan",
  "Darren Frederick Beken",
  "Derin Rizki Pratama",
  "Dika Nanda Saputra",
  "Disha Ayu Nurul Zahra",
  "Fabian Alfhiansyah",
  "Farhan Fauzan",
  "Gista Suci Ramadani",
  "Imam Maulana Khoirul",
  "M. Azkha Pratama",
  "M. Zaki Fauzi",
  "M Rizky",
  "Muhamad Zaki",
  "Muhammad Halim",
  "Nadia Juwita",
  "Nita Sania",
  "Nurul Mira",
  "Reva Revansya",
  "Revan M Ridwan",
  "Salwa Sri Arumi",
  "Septian",
  "Siti Azahra Nurul Agni",
  "Siti Azzahra Nurul Agni",
  "Siti Sri Harianti Mesya",
  "Syahril Sidik",
  "Yudi Jaenudin"
];

export interface OrganigramItem {
  role: string;
  name: string;
  category: 'wali' | 'pimpinan' | 'sek_ben' | 'seksi';
  icon: string;
  badgeColor: string;
  description: string;
  subMembers?: string[];
}

export const ORGANIGRAM_DATA: OrganigramItem[] = [
  {
    role: "Wali Kelas IX C",
    name: "Doni Faturohman, S.Pd.",
    category: "wali",
    icon: "user-tie",
    badgeColor: "from-amber-400 to-orange-500",
    description: "Pembina dan pendamping utama seluruh proses akademik, kedisiplinan, dan akhlak siswa Kelas IX C MTs Nurul Hidayah Miftahurroja."
  },
  {
    role: "Ketua Kelas (KM)",
    name: "Derin Rizki Pratama",
    category: "pimpinan",
    icon: "crown",
    badgeColor: "from-cyan-400 to-blue-600",
    description: "Memimpin koordinasi kelas, memandu barisan upacara, dan menjembatani komunikasi siswa dengan bapak/ibu guru."
  },
  {
    role: "Wakil Ketua Kelas (WKM)",
    name: "Disha Ayu Nurul Zahra",
    category: "pimpinan",
    icon: "shield-halved",
    badgeColor: "from-indigo-400 to-purple-600",
    description: "Membantu kepemimpinan KM, mengkoordinasi ketertiban ruang kelas, serta monitoring kehadiran harian."
  },
  {
    role: "Sekretaris",
    name: "Alika Azahra Putri",
    category: "sek_ben",
    icon: "pen-fancy",
    badgeColor: "from-purple-400 to-pink-600",
    description: "Mencatat notulensi rapat kelas, rekapitulasi buku agenda kegiatan harian, dan inventarisasi berkas."
  },
  {
    role: "Bendahara",
    name: "Imam Maulana",
    category: "sek_ben",
    icon: "wallet",
    badgeColor: "from-emerald-400 to-teal-600",
    description: "Mengelola kas kebersihan dan sosial kelas IX C dengan amanah, transparan, dan tercatat rapi."
  },
  {
    role: "Seksi Absensi",
    name: "Siti Azahra Nurul Agni & Nadia Juwita",
    category: "seksi",
    icon: "clipboard-check",
    badgeColor: "from-pink-400 to-rose-600",
    description: "Merekap presensi harian, mengecek surat izin/sakit, dan berkoordinasi dengan guru piket madrasah.",
    subMembers: ["1. Siti Azahra Nurul Agni", "2. Nadia Juwita"]
  },
  {
    role: "Seksi Keamanan & Ketertiban",
    name: "Revan M Ridwan & Salwa Sri Arumi",
    category: "seksi",
    icon: "shield",
    badgeColor: "from-red-400 to-red-600",
    description: "Menjaga kekondusifan suasana belajar, kedisiplinan pakaian seragam, dan anti-bullying di kelas.",
    subMembers: ["1. Revan M Ridwan", "2. Salwa Sri Arumi"]
  },
  {
    role: "Seksi Kebersihan & Keindahan",
    name: "Andi Hermawan & Gista Suci",
    category: "seksi",
    icon: "sparkles",
    badgeColor: "from-teal-400 to-emerald-600",
    description: "Memantau kelancaran piket harian, pembuangan sampah, penghijauan, dan kerapian ruang kelas 9C.",
    subMembers: ["1. Andi Hermawan", "2. Gista Suci"]
  },
  {
    role: "Seksi Keagamaan & Ibadah",
    name: "Muhammad Halim & Nita Sania",
    category: "seksi",
    icon: "book-open",
    badgeColor: "from-cyan-400 to-emerald-600",
    description: "Memimpin pembacaan doa pembuka belajar, tadarus Al-Qur'an pagi, serta sholat dhuha dan dhuhur berjamaah.",
    subMembers: ["1. Muhammad Halim", "2. Nita Sania"]
  }
];

export interface JadwalPelajaranHari {
  day: string;
  dayKey: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu';
  colorBorder: string;
  items: {
    jam: string;
    mapel: string;
    tipe: 'upacara' | 'mapel' | 'istirahat';
    color: string;
  }[];
}

export const JADWAL_PELAJARAN_DATA: JadwalPelajaranHari[] = [
  {
    day: "SENIN",
    dayKey: "senin",
    colorBorder: "border-sky-500/40",
    items: [
      { jam: "Jam 1-2 (07.00 - 08.00)", mapel: "UPACARA BENDERA", tipe: "upacara", color: "text-amber-300" },
      { jam: "Jam 3-4 (08.00 - 09.10)", mapel: "IPA", tipe: "mapel", color: "text-sky-300" },
      { jam: "Jam 5 (09.10 - 09.30)", mapel: "IPS", tipe: "mapel", color: "text-indigo-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT PERTAMA", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6 (10.00 - 10.35)", mapel: "IPS", tipe: "mapel", color: "text-indigo-300" },
      { jam: "Jam 7-9 (10.35 - 12.20)", mapel: "BAHASA INDONESIA", tipe: "mapel", color: "text-emerald-300" }
    ]
  },
  {
    day: "SELASA",
    dayKey: "selasa",
    colorBorder: "border-indigo-500/40",
    items: [
      { jam: "Jam 1-2 (07.00 - 08.00)", mapel: "FIQIH", tipe: "mapel", color: "text-cyan-300" },
      { jam: "Jam 3-4 (08.00 - 09.10)", mapel: "SEJARAH KEBUDAYAAN ISLAM (SKI)", tipe: "mapel", color: "text-purple-300" },
      { jam: "Jam 5 (09.10 - 09.30)", mapel: "BAHASA INGGRIS", tipe: "mapel", color: "text-pink-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6 (10.00 - 10.35)", mapel: "BAHASA INGGRIS", tipe: "mapel", color: "text-pink-300" },
      { jam: "Jam 7-8 (10.35 - 11.45)", mapel: "IPS", tipe: "mapel", color: "text-indigo-300" }
    ]
  },
  {
    day: "RABU",
    dayKey: "rabu",
    colorBorder: "border-purple-500/40",
    items: [
      { jam: "Jam 1-2 (07.00 - 08.00)", mapel: "AL-QUR'AN HADIS (QURDIS)", tipe: "mapel", color: "text-cyan-300" },
      { jam: "Jam 3-5 (08.00 - 09.30)", mapel: "PENDIDIKAN PANCASILA & KEWARGANEGARAAN (PKN)", tipe: "mapel", color: "text-red-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6-7 (10.00 - 11.10)", mapel: "BAHASA SUNDA", tipe: "mapel", color: "text-emerald-300" },
      { jam: "Jam 8-9 (11.10 - 12.20)", mapel: "MATEMATIKA (MTK)", tipe: "mapel", color: "text-blue-300" }
    ]
  },
  {
    day: "KAMIS",
    dayKey: "kamis",
    colorBorder: "border-amber-500/40",
    items: [
      { jam: "Jam 1-3 (07.00 - 08.35)", mapel: "SENI BUDAYA (SBK)", tipe: "mapel", color: "text-pink-300" },
      { jam: "Jam 4-5 (08.35 - 09.30)", mapel: "MATEMATIKA (MTK)", tipe: "mapel", color: "text-blue-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6-9 (10.00 - 12.20)", mapel: "BAHASA ARAB", tipe: "mapel", color: "text-emerald-300" }
    ]
  },
  {
    day: "JUM'AT",
    dayKey: "jumat",
    colorBorder: "border-emerald-500/40",
    items: [
      { jam: "Jam 1-3 (07.00 - 08.35)", mapel: "BAHASA INGGRIS", tipe: "mapel", color: "text-pink-300" },
      { jam: "Jam 4-5 (08.35 - 09.30)", mapel: "AKIDAH AKHLAK", tipe: "mapel", color: "text-cyan-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT / SHOLAT DHUHA", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6-7 (10.00 - 11.10)", mapel: "INFORMATIKA (INFOR)", tipe: "mapel", color: "text-purple-300" }
    ]
  },
  {
    day: "SABTU",
    dayKey: "sabtu",
    colorBorder: "border-pink-500/40",
    items: [
      { jam: "Jam 1-2 (07.00 - 08.00)", mapel: "PJOK / SENAM SEHAT", tipe: "mapel", color: "text-amber-300" },
      { jam: "Jam 3-5 (08.00 - 09.30)", mapel: "IPA", tipe: "mapel", color: "text-sky-300" },
      { jam: "09.30 - 10.00", mapel: "ISTIRAHAT", tipe: "istirahat", color: "text-amber-400" },
      { jam: "Jam 6 (10.00 - 10.35)", mapel: "IPA", tipe: "mapel", color: "text-sky-300" },
      { jam: "Jam 7-9 (10.35 - 12.20)", mapel: "BAHASA INDONESIA", tipe: "mapel", color: "text-emerald-300" }
    ]
  }
];

export interface JadwalPiketHari {
  day: string;
  count: number;
  members: string[];
  color: string;
  note?: string;
}

export const JADWAL_PIKET_DATA: JadwalPiketHari[] = [
  {
    day: "SENIN",
    count: 5,
    color: "sky",
    members: ["Nurul Mira", "Andi Hermawan", "Farhan Fauzan", "Syahril Sidik", "Muhammad Halim"]
  },
  {
    day: "SELASA",
    count: 6,
    color: "indigo",
    members: ["Salwa Sri Arumi", "Siti Sri Harianti Mesya", "Cep Irawan", "Derin Rizki Pratama", "Reva Revansya", "Revan M Ridwan"]
  },
  {
    day: "RABU",
    count: 5,
    color: "purple",
    members: ["Nadia Juwita", "Siti Azzahra Nurul Agni", "M Rizky", "Septian", "Fabian Alfhiansyah"]
  },
  {
    day: "KAMIS",
    count: 6,
    color: "amber",
    members: ["Alika Azahra Putri", "Disha Ayu Nurul Zahra", "M. Azkha Pratama", "Imam Maulana Khoirul", "Yudi Jaenudin", "Muhamad Zaki"]
  },
  {
    day: "JUM'AT",
    count: 5,
    color: "emerald",
    members: ["Gista Suci Ramadani", "Nita Sania", "Dika Nanda Saputra", "Darren Frederick Beken", "M. Zaki Fauzi"]
  },
  {
    day: "SABTU",
    count: 28,
    color: "pink",
    members: ["Seluruh Siswa Kelas IX C (Kerja Bakti Rolling)"],
    note: "Piket kelompok berganti giliran secara mingguan & kerja bakti pembersihan menyeluruh madrasah."
  }
];

export interface TKASoal {
  id: number;
  category: 'LITERASI' | 'NUMERASI';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const BANK_SOAL_TKA: TKASoal[] = [
  // 1-15 LITERASI
  {
    id: 1,
    category: "LITERASI",
    question: "Bacalah paragraf berikut: 'Kebersihan lingkungan sekolah merupakan tanggung jawab bersama seluruh warga sekolah. Lingkungan yang bersih menciptakan suasana belajar yang nyaman dan sehat sehingga daya serap materi siswa meningkat secara optimal.' Apakah ide pokok dari paragraf tersebut?",
    options: [
      "A. Tanggung jawab kebersihan lingkungan sekolah",
      "B. Suasana belajar di sekolah yang bising",
      "C. Kebersihan sekolah adalah tanggung jawab guru piket semata",
      "D. Cara membersihkan saluran air lingkungan sekolah"
    ],
    answer: 0,
    explanation: "Ide pokok adalah gagasan inti yang dibahas dalam paragraf. Kalimat utama di awal paragraf menegaskan bahwa kebersihan lingkungan sekolah adalah tanggung jawab bersama seluruh warga sekolah."
  },
  {
    id: 2,
    category: "LITERASI",
    question: "Penggunaan kata baku yang tepat sesuai dengan Pedoman Umum Ejaan Bahasa Indonesia (PUEBI/EYD) terdapat pada kalimat...",
    options: [
      "A. Kita harus mendiagnosa penyakit itu segera di laboratorium.",
      "B. Ibu membeli beberapa obat generik di apotek terdekat.",
      "C. Jadwal pelajaran hari ini sangat padat dan meletihkan.",
      "D. Pengurus kelas sedang melakukan praktek musyawarah di aula."
    ],
    answer: 1,
    explanation: "Kata 'apotek' adalah bentuk baku (bukan apotik). Sementara opsi A kata baku adalah 'mendiagnosis', opsi C kata baku 'jadwal' benar namun apotek lebih definitif standar kata serapan, opsi D kata baku adalah 'praktik' (bukan praktek)."
  },
  {
    id: 3,
    category: "LITERASI",
    question: "Majas perbandingan yang terdapat dalam kalimat 'Wajahnya berseri-seri bagaikan rembulan purnama di malam hari' adalah...",
    options: [
      "A. Metafora",
      "B. Asosiasi / Simile",
      "C. Personifikasi",
      "D. Hiperbola"
    ],
    answer: 1,
    explanation: "Majas asosiasi/simile membandingkan dua hal yang berbeda secara eksplisit menggunakan kata penghubung perbandingan seperti 'bagaikan', 'laksana', 'bak', atau 'seperti'."
  },
  {
    id: 4,
    category: "LITERASI",
    question: "Kalimat berikut yang merupakan kalimat efektif, hemat kata, dan tidak rancu adalah...",
    options: [
      "A. Bagi semua siswa-siswa kelas 9 diwajibkan untuk hadir.",
      "B. Rapat komite itu membahas daripada masalah kebersihan kelas.",
      "C. Siswa kelas IX C sedang mengerjakan simulasi ujian TKA dengan tertib.",
      "D. Demi untuk menjaga kesehatan tubuh kita harus makan buah."
    ],
    answer: 2,
    explanation: "Opsi C memiliki struktur Subjek (Siswa kelas IX C), Predikat (sedang mengerjakan), Objek (simulasi ujian TKA), Keterangan (dengan tertib) yang padu tanpa pemborosan kata."
  },
  {
    id: 5,
    category: "LITERASI",
    question: "Makna kata 'signifikan' dalam konteks kalimat 'Penerapan metode Sokratik memberikan peningkatan signifikan terhadap nilai asesmen siswa' adalah...",
    options: [
      "A. Sangat kecil dan lambat",
      "B. Berarti, penting, dan berdampak nyata",
      "C. Kurang jelas dan kabur",
      "D. Berlawanan arah dengan tujuan"
    ],
    answer: 1,
    explanation: "Signifikan berarti meyakinkan, penting, atau memberikan dampak nyata yang berbobot."
  },
  {
    id: 6,
    category: "LITERASI",
    question: "Karangan atau teks yang bertujuan meyakinkan pembaca dengan menyajikan fakta, data empiris, dan penalaran logis dinamakan teks...",
    options: [
      "A. Deskripsi",
      "B. Narasi",
      "C. Argumentasi",
      "D. Eksplanasi"
    ],
    answer: 2,
    explanation: "Teks argumentasi bertujuan meyakinkan dan membuktikan kebenaran pendapat kepada pembaca melalui argumen dan fakta pendukung."
  },
  {
    id: 7,
    category: "LITERASI",
    question: "Penulisan nama dan gelar akademik yang sesuai dengan EYD Edisi V adalah...",
    options: [
      "A. Doni Faturohman S,Pd.",
      "B. Doni Faturohman, S.Pd.",
      "C. Doni Faturohman S.Pd",
      "D. Doni Faturohman, SPd."
    ],
    answer: 1,
    explanation: "Gelar akademik dipisahkan dengan tanda koma (,) dari nama orang, dan disingkat dengan tanda titik di antara huruf singkatan (S.Pd. untuk Sarjana Pendidikan)."
  },
  {
    id: 8,
    category: "LITERASI",
    question: "Sinonim kata 'konsisten' dalam pelaksanaan ibadah dan ketertiban belajar adalah...",
    options: [
      "A. Berubah-ubah sesuai kondisi",
      "B. Taat asas / Istiqomah",
      "C. Cepat tanggap sesaat",
      "D. Ragu-ragu dalam mengambil keputusan"
    ],
    answer: 1,
    explanation: "Konsisten berarti tetap teguh, taat asas, atau selaras dengan konsep 'istiqomah' dalam ajaran Islam."
  },
  {
    id: 9,
    category: "LITERASI",
    question: "Unsur intrinsik cerpen atau novel yang menerangkan tempat, waktu, dan suasana terjadinya suatu peristiwa adalah...",
    options: [
      "A. Tema sentral",
      "B. Alur / Plot",
      "C. Latar / Setting",
      "D. Amanat moral"
    ],
    answer: 2,
    explanation: "Latar (setting) terbagi menjadi tiga aspek utama: latar tempat, latar waktu, dan latar suasana emosional cerita."
  },
  {
    id: 10,
    category: "LITERASI",
    question: "Manakah di bawah ini yang merupakan kalimat opini (pendapat subjektif)?",
    options: [
      "A. MTs Nurul Hidayah Miftahurroja beroperasi pada Tahun Ajaran 2026/2027.",
      "B. Kelas 9C memiliki total 28 orang siswa terdaftar.",
      "C. Pelajaran Matematika merupakan pelajaran yang paling seru dan mudah dipelajari.",
      "D. Upacara bendera di madrasah diselenggarakan pada hari Senin pagi."
    ],
    answer: 2,
    explanation: "Kalimat C merupakan opini pribadi karena persepsi mudah/menyenangkannya Matematika berbeda bagi tiap individu."
  },
  {
    id: 11,
    category: "LITERASI",
    question: "'Pengusul menyarankan agar kegiatan piket dilakukan setiap hari.' Kata berimbuhan 'pengusul' memiliki prefiks pe- yang bermakna...",
    options: [
      "A. Alat yang digunakan",
      "B. Orang yang melakukan tindakan mengusulkan",
      "C. Tempat terjadinya perbuatan",
      "D. Hasil dari perbuatan"
    ],
    answer: 1,
    explanation: "Awalan pe- pada kata dasar 'usul' membentuk nomina pelaku atau orang yang mengusulkan."
  },
  {
    id: 12,
    category: "LITERASI",
    question: "Tujuan utama menyusun rangkuman (ikhtisar) dari sebuah buku referensi ilmiah adalah...",
    options: [
      "A. Mengubah alur pemikiran penulis asli",
      "B. Menyajikan kembali sari pati bacaan secara padat, jelas, dan singkat",
      "C. Menambahkan opini kontra tanpa bukti",
      "D. Mempertebal ukuran halaman dokumen"
    ],
    answer: 1,
    explanation: "Rangkuman bertujuan menyarikan pokok-pokok informasi secara ringkas tanpa menghilangkan esensi pesan penulis asli."
  },
  {
    id: 13,
    category: "LITERASI",
    question: "Penggunaan tanda baca koma (,) untuk rincian tiga unsur atau lebih yang tepat adalah...",
    options: [
      "A. Saya membeli pensil, buku tulis, dan penggaris segitiga.",
      "B. Ibu membeli pensil, buku tulis dan, penggaris.",
      "C. Saya membeli, pensil buku dan penggaris.",
      "D. Saya membeli pensil buku, dan penggaris."
    ],
    answer: 0,
    explanation: "Dalam kalimat rincian lebih dari dua unsur, tanda koma dipakai sebelum kata hubung 'dan'."
  },
  {
    id: 14,
    category: "LITERASI",
    question: "Lawan kata (antonim) dari sifat 'optimis' dalam menghadapi ujian akhir adalah...",
    options: [
      "A. Realistis",
      "B. Pesimis",
      "C. Humoris",
      "D. Dinamis"
    ],
    answer: 1,
    explanation: "Optimis adalah sikap berpengharapan baik; antonimnya adalah pesimis (sikap mudah putus asa atau memandang suram)."
  },
  {
    id: 15,
    category: "LITERASI",
    question: "Inti pesan kebajikan yang ingin disampaikan pengarang kepada pembaca melalui karyanya disebut...",
    options: [
      "A. Sudut pandang",
      "B. Amanat",
      "C. Klimaks",
      "D. Konflik batin"
    ],
    answer: 1,
    explanation: "Amanat adalah pesan moral, nilai etika, atau hikmah yang ingin dipetik oleh pembaca."
  },

  // 16-30 NUMERASI
  {
    id: 16,
    category: "NUMERASI",
    question: "Bentuk paling sederhana dari operasi aljabar: 3x + 5y - (2x - 3y) adalah...",
    options: [
      "A. x + 8y",
      "B. x + 2y",
      "C. 5x + 8y",
      "D. 5x + 2y"
    ],
    answer: 0,
    explanation: "3x + 5y - 2x + 3y = (3x - 2x) + (5y + 3y) = x + 8y."
  },
  {
    id: 17,
    category: "NUMERASI",
    question: "Jika persamaan linier satu variabel 2(x - 3) = 14 dipenuhi, maka nilai dari x adalah...",
    options: [
      "A. 7",
      "B. 8",
      "C. 10",
      "D. 12"
    ],
    answer: 2,
    explanation: "2x - 6 = 14 => 2x = 14 + 6 = 20 => x = 20 / 2 = 10."
  },
  {
    id: 18,
    category: "NUMERASI",
    question: "Sebuah wadah berbentuk kubus memiliki panjang rusuk 6 cm. Volume wadah tersebut adalah...",
    options: [
      "A. 36 cm³",
      "B. 144 cm³",
      "C. 216 cm³",
      "D. 256 cm³"
    ],
    answer: 2,
    explanation: "Volume kubus = s³ = 6 x 6 x 6 = 216 cm³."
  },
  {
    id: 19,
    category: "NUMERASI",
    question: "Sebuah bus rombongan madrasah menempuh jarak 120 km dalam waktu 2 jam. Berapakah kecepatan rata-rata bus tersebut?",
    options: [
      "A. 50 km/jam",
      "B. 60 km/jam",
      "C. 70 km/jam",
      "D. 80 km/jam"
    ],
    answer: 1,
    explanation: "Kecepatan v = s / t = 120 km / 2 jam = 60 km/jam."
  },
  {
    id: 20,
    category: "NUMERASI",
    question: "Nilai rata-rata (mean) dari data nilai harian Matematika: 7, 8, 6, 9, 10 adalah...",
    options: [
      "A. 7.5",
      "B. 8.0",
      "C. 8.5",
      "D. 9.0"
    ],
    answer: 1,
    explanation: "Mean = (7 + 8 + 6 + 9 + 10) / 5 = 40 / 5 = 8.0."
  },
  {
    id: 21,
    category: "NUMERASI",
    question: "Pecahan biasa 45/60 jika disederhanakan hingga bentuk paling sederhana adalah...",
    options: [
      "A. 2/3",
      "B. 3/4",
      "C. 4/5",
      "D. 3/5"
    ],
    answer: 1,
    explanation: "FPB dari 45 dan 60 adalah 15. (45 : 15) / (60 : 15) = 3/4."
  },
  {
    id: 22,
    category: "NUMERASI",
    question: "Di kelas 9C terdapat 28 siswa. Jika perbandingan jumlah siswa laki-laki dan perempuan adalah 3 : 4, berapa banyakkah siswa perempuan?",
    options: [
      "A. 12 siswa",
      "B. 14 siswa",
      "C. 16 siswa",
      "D. 18 siswa"
    ],
    answer: 2,
    explanation: "Total bagian rasio = 3 + 4 = 7 bagian. Jumlah siswa perempuan = (4 / 7) x 28 = 4 x 4 = 16 siswa."
  },
  {
    id: 23,
    category: "NUMERASI",
    question: "Bentuk sederhana dari bentuk akar √72 adalah...",
    options: [
      "A. 6√2",
      "B. 8√2",
      "C. 9√2",
      "D. 12√2"
    ],
    answer: 0,
    explanation: "√72 = √(36 x 2) = √36 x √2 = 6√2."
  },
  {
    id: 24,
    category: "NUMERASI",
    question: "Sebuah lapangan madrasah berbentuk persegi panjang dengan ukuran panjang 12 meter dan lebar 8 meter. Keliling lapangan tersebut adalah...",
    options: [
      "A. 20 meter",
      "B. 40 meter",
      "C. 96 meter",
      "D. 48 meter"
    ],
    answer: 1,
    explanation: "Keliling = 2 x (panjang + lebar) = 2 x (12 + 8) = 2 x 20 = 40 meter."
  },
  {
    id: 25,
    category: "NUMERASI",
    question: "Peluang munculnya mata dadu bernilai genap pada pelemparan satu buah dadu bersisi enam adalah...",
    options: [
      "A. 1/6",
      "B. 1/3",
      "C. 1/2",
      "D. 2/3"
    ],
    answer: 2,
    explanation: "Titik sampel genap = {2, 4, 6} (ada 3). Ruang sampel = {1, 2, 3, 4, 5, 6} (ada 6). Peluang = 3/6 = 1/2."
  },
  {
    id: 26,
    category: "NUMERASI",
    question: "Jika persamaan eksponen 3ⁿ = 81 bernilai benar, maka nilai bilangan n adalah...",
    options: [
      "A. 3",
      "B. 4",
      "C. 5",
      "D. 6"
    ],
    answer: 1,
    explanation: "81 = 3 x 3 x 3 x 3 = 3⁴. Maka n = 4."
  },
  {
    id: 27,
    category: "NUMERASI",
    question: "Hasil penjabaran aljabar dari perkalian suku dua (2x + 3)(x - 4) adalah...",
    options: [
      "A. 2x² - 5x - 12",
      "B. 2x² + 5x - 12",
      "C. 2x² - 11x - 12",
      "D. 2x² + 11x - 12"
    ],
    answer: 0,
    explanation: "(2x)(x) + (2x)(-4) + (3)(x) + (3)(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12."
  },
  {
    id: 28,
    category: "NUMERASI",
    question: "Sebuah segitiga siku-siku memiliki panjang alas 6 cm dan tinggi 8 cm. Panjang sisi miring (hipotenusa) berdasarkan teorema Pythagoras adalah...",
    options: [
      "A. 9 cm",
      "B. 10 cm",
      "C. 12 cm",
      "D. 14 cm"
    ],
    answer: 1,
    explanation: "c = √(a² + b²) = √(6² + 8²) = √(36 + 64) = √100 = 10 cm."
  },
  {
    id: 29,
    category: "NUMERASI",
    question: "Nilai median (nilai tengah) dari urutan data: 4, 5, 6, 7, 8, 9, 10 adalah...",
    options: [
      "A. 6",
      "B. 7",
      "C. 8",
      "D. 7.5"
    ],
    answer: 1,
    explanation: "Banyaknya data ganjil (n = 7). Median terletak pada data ke-(7+1)/2 = data ke-4, yaitu 7."
  },
  {
    id: 30,
    category: "NUMERASI",
    question: "Sebuah seragam pramuka diberi diskon 20% dari harga normal Rp 150.000,00. Berapakah nominal rupiah yang harus dibayarkan?",
    options: [
      "A. Rp 110.000,00",
      "B. Rp 120.000,00",
      "C. Rp 125.000,00",
      "D. Rp 130.000,00"
    ],
    answer: 1,
    explanation: "Diskon = 20% x 150.000 = Rp 30.000. Harga bayar = 150.000 - 30.000 = Rp 120.000,00."
  }
];

export const YOUTUBE_PRESETS = [
  { label: "🔬 IPA Terpadu Kelas 9", query: "materi IPA kelas 9 kurikulum merdeka" },
  { label: "📐 Matematika Kelas 9", query: "matematika kelas 9 persamaan kuadrat" },
  { label: "📖 Fiqih MTs Kelas 9", query: "fiqih mts kelas 9 kma 183" },
  { label: "🕌 Al-Qur'an Hadis MTs", query: "al quran hadis kelas 9 mts" },
  { label: "📜 SKI Khilafah & Nusantara", query: "sejarah kebudayaan islam mts kelas 9" },
  { label: "🗣️ Bahasa Arab Percakapan", query: "bahasa arab mts kelas 9 percakapan" },
  { label: "✨ Murottal Juz Amma Merdu", query: "murottal juz amma merdu meredakan hati" }
];
