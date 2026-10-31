import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  UserCheck,
  GraduationCap,
  Users,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  FileText,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export function GuruAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di layanan konsultasi resmi **Guru AI MTs Nurul Hidayah Miftahurroja** Tahun Ajaran 2026/2027. Saya siap mendampingi Bapak/Ibu Guru, adik-adik siswa (Kelas 7, 8, dan 9), serta Bapak/Ibu Orang Tua murid.\n\nBagaimana saya dapat membantu proses pembelajaran dan pendidikan madrasah hari ini?`,
      timestamp: 'Baru saja'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roleMode, setRoleMode] = useState<'guru' | 'siswa' | 'orangtua'>('guru');
  const [selectedClass, setSelectedClass] = useState('9C');
  const [selectedSubject, setSelectedSubject] = useState('Semua Mapel');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputValue.trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const contextInfo = {
        rolePengguna: roleMode === 'guru' ? 'Bapak/Ibu Guru' : roleMode === 'siswa' ? 'Siswa MTs' : 'Orang Tua Murid',
        targetKelas: selectedClass,
        mataPelajaran: selectedSubject,
        tahunAjaran: '2026/2027',
        sekolah: 'MTs Nurul Hidayah Miftahurroja'
      };

      const response = await fetch('/api/guru-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          conversationHistory: historyPayload,
          contextInfo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses respon dari Guru AI.');
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Mohon maaf, terjadi kendala saat merumuskan respon. Silakan ajukan pertanyaan kembali.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'model',
          text: `Assalamu'alaikum Wr. Wb. Mohon maaf atas ketidaknyamanan ini: ${err.message || 'Koneksi ke sistem AI sedang mengalami penundaan'}. Silakan periksa pengaturan jaringan Anda atau coba sesaat lagi.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_PROMPTS = [
    {
      title: 'Modul Ajar Kurikulum Merdeka',
      prompt: `Tolong susunkan draf Modul Ajar Kurikulum Merdeka terintegrasi nilai keislaman untuk Kelas ${selectedClass} pada mata pelajaran ${selectedSubject === 'Semua Mapel' ? 'IPA' : selectedSubject}. Cantumkan Identitas Modul, Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Profil Pelajar Pancasila & Rahmatan Lil Alamin, Langkah Pembelajaran (Pendahuluan, Inti, Penutup), dan Asesmen.`
    },
    {
      title: 'Bimbingan Tugas Sokratik',
      prompt: `Assalamu'alaikum Guru AI, saya siswa Kelas ${selectedClass}. Tolong bimbing saya memahami konsep materi ${selectedSubject === 'Semua Mapel' ? 'Matematika' : selectedSubject} dengan metode Sokratik. Jangan beri jawaban langsung, berikan pertanyaan pemantik dan langkah pemikiran terlebih dahulu!`
    },
    {
      title: 'Kisi-kisi Soal HOTS & Rubrik',
      prompt: `Buatkan kisi-kisi 5 butir soal pilihan ganda berbasis HOTS (Higher Order Thinking Skills) beserta kunci jawaban dan rubrik penilaian asesmen untuk Kelas ${selectedClass} MTs Nurul Hidayah Miftahurroja.`
    },
    {
      title: 'Integrasi Nilai Keislaman',
      prompt: `Bagaimana cara mengintegrasikan ayat Al-Qur'an, Hadis Nabi, atau nilai akhlakul karimah ke dalam materi pembelajaran ${selectedSubject === 'Semua Mapel' ? 'Tata Surya dan Alam Semesta' : selectedSubject} untuk siswa Kelas ${selectedClass}?`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-emerald-500/30 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
              <Bot className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> MTs Nurul Hidayah Miftahurroja • TA 2026/2027
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Guru AI & Pendamping Akademik Islami
              </h2>
              <p className="text-xs text-slate-300">
                Layanan perancangan Modul Ajar Kurikulum Merdeka, pembimbing tugas metode Sokratik, dan integrasi nilai keislaman madrasah.
              </p>
            </div>
          </div>

          {/* Context Selector Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Switcher */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setRoleMode('guru')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  roleMode === 'guru'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Guru
              </button>
              <button
                onClick={() => setRoleMode('siswa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  roleMode === 'siswa'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Siswa
              </button>
              <button
                onClick={() => setRoleMode('orangtua')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  roleMode === 'orangtua'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Orang Tua
              </button>
            </div>

            {/* Target Class Dropdown */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-sky-300 font-bold flex items-center gap-2">
              <span className="text-slate-400 font-normal">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-sky-300 font-bold focus:outline-none cursor-pointer"
              >
                <optgroup label="Kelas 9">
                  <option value="9C" className="bg-slate-900 text-white">Kelas 9C (Wali: Doni Faturohman, S.Pd.)</option>
                  <option value="9A" className="bg-slate-900 text-white">Kelas 9A</option>
                  <option value="9B" className="bg-slate-900 text-white">Kelas 9B</option>
                </optgroup>
                <optgroup label="Kelas 8">
                  <option value="8A" className="bg-slate-900 text-white">Kelas 8A</option>
                  <option value="8B" className="bg-slate-900 text-white">Kelas 8B</option>
                  <option value="8C" className="bg-slate-900 text-white">Kelas 8C</option>
                </optgroup>
                <optgroup label="Kelas 7">
                  <option value="7A" className="bg-slate-900 text-white">Kelas 7A</option>
                  <option value="7B" className="bg-slate-900 text-white">Kelas 7B</option>
                  <option value="7C" className="bg-slate-900 text-white">Kelas 7C</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            className="glass-card p-3.5 rounded-2xl border border-slate-700/70 hover:border-emerald-500/50 text-left transition-all hover:scale-[1.02] space-y-1.5 group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{qp.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {qp.prompt}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="glass-card rounded-3xl p-4 md:p-6 space-y-4 border border-slate-700/70 min-h-[460px] flex flex-col justify-between shadow-2xl">
        <div className="space-y-4 overflow-y-auto max-h-[520px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-4 space-y-2 text-xs md:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-xs shadow-lg'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-100 rounded-tl-xs shadow-lg'
                }`}
              >
                <div className="flex justify-between items-center pb-1 border-b border-slate-700/40 text-[10px] text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    {msg.role === 'user' ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" /> Anda ({roleMode === 'guru' ? 'Guru' : roleMode === 'siswa' ? 'Siswa' : 'Orang Tua'})
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guru AI MTs Nurul Hidayah Miftahurroja
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'model' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-emerald-300 transition-colors p-1"
                        title="Salin teks"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-normal text-slate-200 selection:bg-emerald-500 selection:text-white">
                  {msg.text}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-emerald-300 animate-pulse bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-2xl w-fit">
              <Bot className="w-5 h-5 text-emerald-400 animate-spin" />
              <span>Guru AI sedang menyusun materi & konsultasi terstruktur...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Tanyakan pada Guru AI (e.g. susun Modul Ajar, panduan TP, penjelasan Sokratik Kelas ${selectedClass})...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black text-xs md:text-sm rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span>Kurikulum Merdeka 2026/2027 • Berlandaskan Nilai Keislaman & Pesantren</span>
            <span className="text-emerald-400 font-medium">Model: Gemini 3.8 Flash Full-Stack</span>
          </div>
        </div>
      </div>
    </div>
  );
}
