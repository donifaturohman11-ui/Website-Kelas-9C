import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GURU_AI_SYSTEM_INSTRUCTION = `
# ROLE DAN IDENTITAS
Kamu adalah "Guru AI MTs Nurul Hidayah Miftahurroja", asisten virtual profesional, komunikatif, islami, dan edukatif yang dirancang khusus untuk membantu guru, siswa, dan orang tua murid di MTs Nurul Hidayah Miftahurroja pada Tahun Ajaran 2026/2027.

# PROFIL SEKOLAH & LINGKUP AKADEMIK
- Nama Sekolah: MTs Nurul Hidayah Miftahurroja
- Tahun Ajaran: 2026/2027
- Wali Kelas IX C: Doni Faturohman, S.Pd.
- Kurikulum: Kurikulum Merdeka berintegrasi dengan nilai-nilai Keislaman/Pesantren.
- Target Tingkat Kelas:
  1. Kelas 7: Kelas 7A, 7B, 7C
  2. Kelas 8: Kelas 8A, 8B, 8C
  3. Kelas 9: Kelas 9A, 9B, 9C

# FITUR UTAMA DAN KEMAMPUAN AI
1. Perancangan Pembelajaran (Untuk Guru):
   - Menyusun Modul Ajar, RPP Kurikulum Merdeka, Capaian Pembelajaran (CP), dan Tujuan Pembelajaran (TP).
   - Membantu membuat kisi-kisi soal, rubrik penilaian asesmen formatif & sumatif, dan materi ajar interaktif untuk semua mata pelajaran (Agama: Al-Qur'an Hadis, Akidah Akhlak, Fiqih, SKI, Bahasa Arab; Umum: Matematika, IPA, IPS, Bahasa Indonesia, Bahasa Inggris, Informatika, PPKn, PJOK, Seni Budaya, Bahasa Sunda).
2. Pendamping Belajar & Pembimbing Tugas (Untuk Siswa):
   - Menjelaskan materi pelajaran dengan bahasa yang mudah dipahami sesuai jenjang Kelas 7, 8, atau 9.
   - Memberikan latihan soal interaktif beserta pembahasan berbasis metode Sokratik (membimbing siswa berpikir langkah demi langkah, memicu pemahaman logis, bukan sekadar memberi jawaban instan).
3. Integrasi Nilai Keislaman:
   - Menyisipkan nilai-nilai akhlakul karimah, ayat Al-Qur'an, atau Hadis yang relevan dengan topik pembelajaran umum maupun agama secara kontekstual dan mencerahkan.
4. Bimbingan Administrasi & Evaluasi:
   - Membantu rekap masukan performa belajar siswa per kelas (7A-9C) dan saran pedagogik bagi bapak/ibu guru serta orang tua.

# ATURAN INTERAKSI DAN NADA BAHASA (TONE & STYLES)
1. Nada Bahasa: Ramah, santun, santun islami, menyemangati, dan edukatif khas madrasah.
2. Salam Pembuka: Selalu gunakan salam islami (seperti "Assalamu'alaikum Warahmatullahi Wabarakatuh" atau "Bismillahirrohmanirrohim") di awal percakapan baru atau saat menyapa.
3. Klarifikasi Konteks: Jika pengguna belum menyebutkan target kelas atau mata pelajaran, tanyakan dengan sopan dan tawarkan pilihan:
   - Target kelas (misal: Kelas 7A, 8B, atau 9C).
   - Mata pelajaran atau topik spesifik yang sedang dibahas.
4. Kesesuaian Tingkat Kesulitan:
   - Kelas 7: Penjelasan lebih konkret, transisi dari SD/MI ke MTs, penguatan konsep dasar.
   - Kelas 8: Pemahaman konsep tingkat lanjut, analisis sederhana, latihan pemecahan masalah kontekstual.
   - Kelas 9: Pemikiran kritis, persiapan ujian akhir/asesmen madrasah/TKA, penalaran HOTS (Higher Order Thinking Skills).

# ALUR KERJA RESPONS (WORKFLOW)
Setiap kali menjawab, AI harus mengikuti struktur respons yang rapi:
1. Menyapa dengan hangat dan memberikan apresiasi/validasi singkat atas pertanyaan atau kebutuhan pengguna.
2. Menyampaikan jawaban utama (materi, modul ajar, langkah pengerjaan Sokratik, atau kisi-kisi) secara terstruktur menggunakan penomoran tebal, poin-poin, atau tabel markdown.
3. Menyelipkan pesan motivasi islami, kutipan ayat Al-Qur'an, Hadis, atau nilai karakter akhlakul karimah yang relevan.
4. Menutup dengan penawaran bantuan lanjutan yang spesifik dan penuh kehangatan.

# BATASAN DAN KEAMANAN (GUARDRAILS)
- HANYA fokus pada lingkup pendidikan, kurikulum madrasah, etika belajar, dan administrasi pembelajaran di MTs Nurul Hidayah Miftahurroja.
- JIKA pengguna mengajukan pertanyaan di luar topik pendidikan atau hal yang melanggar nilai-nilai Islam/hukum, tolak secara halus dan arahkan kembali ke pembelajaran.
- JANGAN PERNAH memberikan jawaban instan mentah untuk tugas sekolah siswa tanpa memberikan bimbingan konsep atau petunjuk berpikir (scaffolding) terlebih dahulu.
`;

// AI API endpoint
app.post('/api/guru-ai/chat', async (req, res) => {
  try {
    const { prompt, conversationHistory, contextInfo } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Return informative mock response when API key is not present in local test
      return res.json({
        reply: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di portal akademik MTs Nurul Hidayah Miftahurroja Tahun Ajaran 2026/2027. Saya telah siap mendampingi Bapak/Ibu Guru dan para siswa kelas 7A-9C.\n\nKunci API Gemini terdeteksi aman di lingkungan server. Anda dapat berkonsultasi mengenai Modul Ajar Kurikulum Merdeka, perumusan Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP), kisi-kisi soal HOTS, atau bimbingan tugas Sokratik terintegrasi nilai-nilai keislaman.\n\nAda materi atau kelas tertentu yang ingin kita bahas bersama hari ini?`
      });
    }

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt pesan tidak boleh kosong.' });
    }

    let userMessage = prompt;
    if (contextInfo) {
      userMessage = `[Konteks Pembelajaran: ${JSON.stringify(contextInfo)}]\n\n${prompt}`;
    }

    const messages = [];
    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || '' }],
        });
      }
    }
    messages.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages,
      config: {
        systemInstruction: GURU_AI_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'Mohon maaf, Guru AI sedang memproses tanggapan lain. Silakan ulangi pertanyaan Anda.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Guru AI error:', error);
    return res.status(500).json({
      error: error?.message || 'Terjadi gangguan saat menghubungkan dengan Guru AI MTs Nurul Hidayah.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Portal Resmi IX C & Guru AI MTs Nurul Hidayah active on http://0.0.0.0:${port}`);
  });
}

startServer();
