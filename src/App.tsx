import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  Network,
  UserCheck,
  PieChart,
  Calendar,
  Sparkles,
  Brush,
  MessageSquare,
  GraduationCap,
  Gamepad2,
  Tv,
  Music,
  Shield,
  ShieldAlert,
  Search,
  Download,
  Lock,
  Unlock,
  Heart,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Award,
  Volume2,
  VolumeX,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DAFTAR_SISWA_9C,
  ORGANIGRAM_DATA,
  JADWAL_PELAJARAN_DATA,
  JADWAL_PIKET_DATA,
  BANK_SOAL_TKA,
  YOUTUBE_PRESETS
} from './data/portalData';
import { ArcadeGames } from './components/ArcadeGames';
import { GuruAIAssistant } from './components/GuruAIAssistant';

type TabKey =
  | 'dashboard'
  | 'organigram'
  | 'absen'
  | 'rekap'
  | 'jadwal-mapel'
  | 'jadwal-piket'
  | 'linimasa'
  | 'tka'
  | 'game'
  | 'youtube'
  | 'guru-ai';

interface AttendanceRecord {
  [date: string]: {
    [studentName: string]: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  };
}

interface LinimasaPost {
  id: number;
  author: string;
  role: string;
  text: string;
  time: string;
  likes: number;
  isPinned?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return (localStorage.getItem('activeTab9C') as TabKey) || 'dashboard';
  });

  // Admin and Pin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn9C') === 'true';
  });
  const [isAbsenUnlocked, setIsAbsenUnlocked] = useState<boolean>(() => {
    return (
      localStorage.getItem('absenUnlocked9C') === 'true' ||
      localStorage.getItem('isAdminLoggedIn9C') === 'true'
    );
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [absenPinInput, setAbsenPinInput] = useState('');

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Attendance State
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchStudent, setSearchStudent] = useState('');
  const [presensiData, setPresensiData] = useState<AttendanceRecord>(() => {
    const saved = localStorage.getItem('presensiData9C');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Linimasa State
  const [linimasaPosts, setLinimasaPosts] = useState<LinimasaPost[]>(() => {
    const saved = localStorage.getItem('linimasaPosts9C');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 1,
        author: 'Doni Faturohman, S.Pd.',
        role: 'Wali Kelas IX C',
        text: "Assalamu'alaikum Wr. Wb. Selamat beraktivitas seluruh siswa-siswi IX C tercinta! Tetap jaga sholat 5 waktu, kedisiplinan piket harian, dan persiapkan diri menyambut simulasi Ujian TKA.",
        time: 'Pagi Hari Ini',
        likes: 18,
        isPinned: true
      },
      {
        id: 2,
        author: 'Derin Rizki Pratama',
        role: 'Ketua Kelas IX C',
        text: 'Mengingatkan teman-teman yang bertugas piket hari ini agar datang lebih awal 15 menit sebelum bel masuk berbunyi ya! Semangat selalu.',
        time: 'Kemarin',
        likes: 9
      }
    ];
  });
  const [newPostText, setNewPostText] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');

  // Jadwal Filter State
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');

  // Ujian TKA State
  const [tkaStarted, setTkaStarted] = useState(false);
  const [tkaFinished, setTkaFinished] = useState(false);
  const [tkaCurrentIdx, setTkaCurrentIdx] = useState(0);
  const [tkaAnswers, setTkaAnswers] = useState<(number | null)[]>(() => new Array(30).fill(null));
  const [tkaSecondsLeft, setTkaSecondsLeft] = useState<number>(3600); // 60 menit
  const [showTkaPembahasan, setShowTkaPembahasan] = useState(false);

  // YouTube State
  const [ytSearch, setYtSearch] = useState('');
  const [ytIframeSrc, setYtIframeSrc] = useState(
    'https://www.youtube-nocookie.com/embed/results?search_query=materi+IPA+kelas+9+kurikulum+merdeka'
  );

  // Persist Active Tab
  useEffect(() => {
    localStorage.setItem('activeTab9C', activeTab);
  }, [activeTab]);

  // Persist Attendance
  useEffect(() => {
    localStorage.setItem('presensiData9C', JSON.stringify(presensiData));
  }, [presensiData]);

  // Persist Linimasa
  useEffect(() => {
    localStorage.setItem('linimasaPosts9C', JSON.stringify(linimasaPosts));
  }, [linimasaPosts]);

  // Current day name in Indonesian
  const todayDayName = useMemo(() => {
    const day = new Date().getDay();
    const map = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return map[day];
  }, []);

  // TKA Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (tkaStarted && !tkaFinished && tkaSecondsLeft > 0) {
      interval = setInterval(() => {
        setTkaSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishTKA();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tkaStarted, tkaFinished, tkaSecondsLeft]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  // Admin verification (PIN 010189)
  const handleVerifyAdmin = () => {
    if (adminPinInput === '010189') {
      setIsAdminLoggedIn(true);
      setIsAbsenUnlocked(true);
      localStorage.setItem('isAdminLoggedIn9C', 'true');
      localStorage.setItem('absenUnlocked9C', 'true');
      setShowAdminModal(false);
      setAdminPinInput('');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      alert('Kata sandi / PIN salah! Silakan coba lagi atau tanyakan pada Wali Kelas.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsAbsenUnlocked(false);
    localStorage.removeItem('isAdminLoggedIn9C');
    localStorage.removeItem('absenUnlocked9C');
  };

  // Unlock Absen Screen with PIN
  const handleUnlockAbsen = () => {
    if (absenPinInput === '010189') {
      setIsAbsenUnlocked(true);
      localStorage.setItem('absenUnlocked9C', 'true');
      setAbsenPinInput('');
    } else {
      alert('Kode PIN Presensi Salah! PIN default pengurus/Wali Kelas adalah 010189');
    }
  };

  // Attendance update
  const setStudentStatus = (name: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setPresensiData((prev) => {
      const dayRec = { ...(prev[selectedDate] || {}) };
      dayRec[name] = status;
      return { ...prev, [selectedDate]: dayRec };
    });
  };

  const markAllPresent = () => {
    setPresensiData((prev) => {
      const dayRec = { ...(prev[selectedDate] || {}) };
      DAFTAR_SISWA_9C.forEach((s) => {
        dayRec[s] = 'Hadir';
      });
      return { ...prev, [selectedDate]: dayRec };
    });
  };

  // Attendance summary counters for selected date
  const attendanceCountsToday = useMemo(() => {
    const dayRec = presensiData[selectedDate] || {};
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpa = 0;

    DAFTAR_SISWA_9C.forEach((nama) => {
      const st = dayRec[nama] || 'Hadir';
      if (st === 'Hadir') hadir++;
      else if (st === 'Izin') izin++;
      else if (st === 'Sakit') sakit++;
      else if (st === 'Alpa') alpa++;
    });

    return { hadir, izin, sakit, alpa };
  }, [presensiData, selectedDate]);

  // Overall Attendance Summary per Student
  const overallSummary = useMemo(() => {
    const map: { [nama: string]: { Hadir: number; Izin: number; Sakit: number; Alpa: number; totalDays: number } } = {};
    DAFTAR_SISWA_9C.forEach((nama) => {
      map[nama] = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0, totalDays: 0 };
    });

    const dates = Object.keys(presensiData);
    dates.forEach((d) => {
      const dayRec = presensiData[d];
      DAFTAR_SISWA_9C.forEach((nama) => {
        const st = dayRec[nama] || 'Hadir';
        map[nama][st]++;
        map[nama].totalDays++;
      });
    });

    return map;
  }, [presensiData]);

  // Export JSON Backup
  const exportBackupJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presensiData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `Presensi_9C_Backup_${todayStr}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Export CSV
  const exportCSV = () => {
    let csv = 'No,Nama Siswa,Hadir,Izin,Sakit,Alpa,Persentase Hadir\n';
    DAFTAR_SISWA_9C.forEach((nama, idx) => {
      const s = overallSummary[nama];
      const pct = s.totalDays > 0 ? Math.round((s.Hadir / s.totalDays) * 100) : 100;
      csv += `${idx + 1},"${nama}",${s.Hadir},${s.Izin},${s.Sakit},${s.Alpa},${pct}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dl = document.createElement('a');
    dl.href = url;
    dl.setAttribute('download', `Rekap_Kehadiran_9C_${todayStr}.csv`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Linimasa Post
  const handlePostLinimasa = () => {
    if (!newPostText.trim()) return;
    const authorName = newPostAuthor.trim() || (isAdminLoggedIn ? 'Doni Faturohman, S.Pd.' : 'Siswa IX C');
    const newPost: LinimasaPost = {
      id: Date.now(),
      author: authorName,
      role: isAdminLoggedIn ? 'Wali Kelas' : 'Siswa 9C',
      text: newPostText.trim(),
      time: 'Baru saja',
      likes: 0
    };
    setLinimasaPosts([newPost, ...linimasaPosts]);
    setNewPostText('');
    setNewPostAuthor('');
  };

  const likePost = (id: number) => {
    setLinimasaPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // TKA Methods
  const handleStartTKA = () => {
    setTkaStarted(true);
    setTkaFinished(false);
    setTkaCurrentIdx(0);
    setTkaAnswers(new Array(30).fill(null));
    setTkaSecondsLeft(3600);
    setShowTkaPembahasan(false);
  };

  const handleFinishTKA = () => {
    setTkaFinished(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  const tkaScore = useMemo(() => {
    let correct = 0;
    BANK_SOAL_TKA.forEach((q, idx) => {
      if (tkaAnswers[idx] === q.answer) correct++;
    });
    const scoreVal = Math.round((correct / 30) * 100);
    return { correct, wrong: 30 - correct, score: scoreVal };
  }, [tkaAnswers]);

  // YouTube Search
  const handleSearchYouTube = () => {
    if (!ytSearch.trim()) return;
    setYtIframeSrc(
      `https://www.youtube-nocookie.com/embed/results?search_query=${encodeURIComponent(ytSearch)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between antialiased selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />
      <div className="bg-glow-3" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      />

      {/* ================= HEADER ================= */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white font-black text-xl tracking-wider hover:scale-105 transition-transform cursor-pointer border border-white/20">
              9C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent">
                  MTs Nurul Hidayah Miftahurroja
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  TA 2026/2027
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Kelas IX C • Wali Kelas: <strong className="text-white font-semibold">Doni Faturohman, S.Pd.</strong>
              </p>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 border ${
                isPlayingAudio
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400/50 shadow-md shadow-indigo-500/20'
                  : 'glass-card hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Musik Latar Relaksasi Belajar"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="hidden md:inline">Titik Nadir 🎵</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden md:inline">Putar Musik</span>
                </>
              )}
            </button>

            {/* Wali Kelas Admin Gate */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Wali Kelas Aktif</span>
                </div>
                <button
                  onClick={handleLogoutAdmin}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                  title="Keluar Mode Wali Kelas"
                >
                  <Unlock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5 border border-slate-700 transition-all hover:scale-105"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Login Wali Kelas</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= NAVIGATION PILLS ================= */}
      <nav className="max-w-7xl mx-auto w-full px-4 pt-3.5 pb-2 z-40">
        <div className="glass-card p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" /> Beranda
          </button>

          <button
            onClick={() => setActiveTab('guru-ai')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'guru-ai'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'text-emerald-300 hover:bg-slate-800/80 hover:text-white border border-emerald-500/30'
            }`}
          >
            <Bot className="w-4 h-4 animate-spin text-emerald-400" /> Guru AI 2026/2027
          </button>

          <button
            onClick={() => setActiveTab('organigram')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'organigram'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4 text-cyan-400" /> Organigram
          </button>

          <button
            onClick={() => setActiveTab('absen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'absen'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" /> Absen Harian
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'rekap'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <PieChart className="w-4 h-4 text-purple-400" /> Rekapitulasi
          </button>

          <button
            onClick={() => setActiveTab('jadwal-mapel')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'jadwal-mapel'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" /> Jadwal Pelajaran
          </button>

          <button
            onClick={() => setActiveTab('jadwal-piket')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'jadwal-piket'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Brush className="w-4 h-4 text-pink-400" /> Jadwal Piket
          </button>

          <button
            onClick={() => setActiveTab('linimasa')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'linimasa'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Linimasa 9C
          </button>

          <button
            onClick={() => setActiveTab('tka')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 border border-amber-500/40 ${
              activeTab === 'tka'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-amber-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-400" /> Ujian TKA (1 Jam)
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-lg'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" /> Zona Game 9C
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg'
                : 'text-sky-200 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4 text-red-500" /> YouTube 9C
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1">
        {/* ================= 1. BERANDA / DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="tab-animating space-y-6">
            {/* Hero Card */}
            <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-sky-500/30 shadow-2xl">
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Selamat Datang di Portal Resmi 9C MTs Nurul Hidayah Miftahurroja
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Kebersamaan, Prestasi & Kedisiplinan{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                    Kelas IX C
                  </span>
                </h2>
                <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
                  Pusat informasi lengkap presensi harian, organigram kepengurusan, jadwal pelajaran 9C, linimasa pengumuman, simulasi Ujian TKA Literasi & Numerasi (1 Jam), zona arcade interaktif, serta integrasi Asisten Guru AI Kurikulum Merdeka Tahun Ajaran 2026/2027.
                </p>

                {/* Quick Real-time Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-700/60 hover:border-sky-500/40 transition-all hover:scale-105">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Siswa</span>
                    <span className="text-xl md:text-2xl font-black text-sky-400">28 Siswa</span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition-all hover:scale-105">
                    <span className="text-[11px] text-slate-400 block font-medium">Hadir Hari Ini</span>
                    <span className="text-xl md:text-2xl font-black text-emerald-400">{attendanceCountsToday.hadir}</span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-700/60 hover:border-amber-500/40 transition-all hover:scale-105">
                    <span className="text-[11px] text-slate-400 block font-medium">Izin / Sakit</span>
                    <span className="text-xl md:text-2xl font-black text-amber-400">
                      {attendanceCountsToday.izin + attendanceCountsToday.sakit}
                    </span>
                  </div>
                  <div className="glass-card p-3.5 rounded-2xl border border-slate-700/60 hover:border-purple-500/40 transition-all hover:scale-105">
                    <span className="text-[11px] text-slate-400 block font-medium">Tanpa Keterangan</span>
                    <span className="text-xl md:text-2xl font-black text-purple-400">{attendanceCountsToday.alpa}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Feature Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Visi & Misi */}
              <div className="glass-card p-6 rounded-3xl space-y-3 hover:border-sky-500/40 transition-all border border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Visi & Misi IX C</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mewujudkan generasi kelas 9C yang berakhlaqul karimah, cerdas akademik, kompak, serta berdedikasi tinggi di MTs Nurul Hidayah Miftahurroja.
                </p>
                <div className="pt-2 text-[11px] text-sky-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Terpadu Kurikulum Merdeka
                </div>
              </div>

              {/* Card 2: Ujian TKA Shortcut */}
              <div
                onClick={() => setActiveTab('tka')}
                className="glass-card p-6 rounded-3xl space-y-3 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Simulasi Ujian TKA (1 Jam)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Latihan 30 Soal TKA Literasi & Numerasi standar Kelas 9 MTs dengan timer hitung mundur 1 Jam (60 Menit) beserta pembahasan detail.
                </p>
                <div className="pt-2 text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  Mulai Simulasi TKA <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Guru AI Assistant Shortcut */}
              <div
                onClick={() => setActiveTab('guru-ai')}
                className="glass-card p-6 rounded-3xl space-y-3 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Guru AI Madrasah 2026/2027
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Asisten cerdas bagi Bapak/Ibu Guru (Modul Ajar & CP/TP) serta siswa (bimbingan tugas berkonsep Sokratik & nilai keislaman).
                </p>
                <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  Buka Konsultasi AI <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Islamic Quote Card */}
            <div className="glass-card rounded-3xl p-5 border border-indigo-500/25 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-indigo-300 italic">
                  "Barang siapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."
                </p>
                <span className="text-[11px] text-slate-400 block font-medium">
                  (HR. Muslim No. 2699) • Pesan Pembina Kelas IX C: Doni Faturohman, S.Pd.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. GURU AI ASSISTANT ================= */}
        {activeTab === 'guru-ai' && (
          <div className="tab-animating">
            <GuruAIAssistant />
          </div>
        )}

        {/* ================= 3. ORGANIGRAM KELAS ================= */}
        {activeTab === 'organigram' && (
          <div className="tab-animating space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 border border-slate-800">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-white">Organigram Resmi IX C</h2>
                <p className="text-xs md:text-sm text-slate-300">
                  Struktur Kepengurusan & Seksi Organisasi Kelas 9C MTs Nurul Hidayah Miftahurroja
                </p>
              </div>

              {/* Tree Level 0: Wali Kelas */}
              <div className="flex justify-center">
                <div className="glass-card p-5 rounded-2xl border border-amber-500/40 text-center w-72 shadow-xl hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl text-slate-950 shadow-lg mb-2.5 font-bold">
                    👨‍🏫
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-0.5">
                    Wali Kelas IX C
                  </span>
                  <h4 className="text-sm font-extrabold text-white">Doni Faturohman, S.Pd.</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Pembina & Pengarah Akademik</p>
                </div>
              </div>

              {/* Connecting line */}
              <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

              {/* Tree Level 1: KM & WKM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="glass-card p-4 rounded-2xl border border-sky-500/30 text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl mb-2">
                    👑
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                    Ketua Kelas (KM)
                  </span>
                  <h4 className="text-sm font-bold text-white">Derin Rizki Pratama</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Koordinator Umum Siswa</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 text-center hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-2">
                    🛡️
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Wakil Ketua (WKM)
                  </span>
                  <h4 className="text-sm font-bold text-white">Disha Ayu Nurul Zahra</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Ketertiban & Monitoring</p>
                </div>
              </div>

              {/* Connecting line */}
              <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

              {/* Tree Level 2: Sekretaris & Bendahara */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="glass-card p-4 rounded-2xl border border-purple-500/30 text-center hover:scale-105 transition-transform">
                  <div className="w-11 h-11 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg mb-2">
                    📝
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    Sekretaris
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-white">Alika Azahra Putri</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Notulensi & Arsip Kelas</p>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 text-center hover:scale-105 transition-transform">
                  <div className="w-11 h-11 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mb-2">
                    💰
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Bendahara
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-white">Imam Maulana</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pengelolaan Kas & Sosial</p>
                </div>
              </div>

              {/* Connecting line */}
              <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

              {/* Tree Level 3: Seksi-Seksi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Absensi */}
                <div className="glass-card p-4 rounded-2xl border border-pink-500/30 text-center space-y-2 hover:border-pink-400 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-base">
                    📋
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block">
                    Seksi Absensi
                  </span>
                  <div className="text-xs space-y-1 text-slate-200 font-medium">
                    <p>1. Siti Azahra Nurul Agni</p>
                    <p>2. Nadia Juwita</p>
                  </div>
                </div>

                {/* Keamanan */}
                <div className="glass-card p-4 rounded-2xl border border-red-500/30 text-center space-y-2 hover:border-red-400 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-base">
                    👮
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                    Seksi Keamanan
                  </span>
                  <div className="text-xs space-y-1 text-slate-200 font-medium">
                    <p>1. Revan M Ridwan</p>
                    <p>2. Salwa Sri Arumi</p>
                  </div>
                </div>

                {/* Kebersihan */}
                <div className="glass-card p-4 rounded-2xl border border-teal-500/30 text-center space-y-2 hover:border-teal-400 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-base">
                    🧹
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                    Seksi Kebersihan
                  </span>
                  <div className="text-xs space-y-1 text-slate-200 font-medium">
                    <p>1. Andi Hermawan</p>
                    <p>2. Gista Suci</p>
                  </div>
                </div>

                {/* Keagamaan */}
                <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 text-center space-y-2 hover:border-cyan-400 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-base">
                    🕌
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                    Seksi Keagamaan
                  </span>
                  <div className="text-xs space-y-1 text-slate-200 font-medium">
                    <p>1. Muhammad Halim</p>
                    <p>2. Nita Sania</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. ABSEN HARIAN ================= */}
        {activeTab === 'absen' && (
          <div className="tab-animating space-y-6">
            {!isAbsenUnlocked ? (
              /* PIN Lock Screen */
              <div className="glass-card rounded-3xl p-8 text-center max-w-md mx-auto space-y-5 border border-amber-500/30 shadow-2xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl shadow-lg">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Presensi Harian Dikunci</h3>
                  <p className="text-xs text-slate-300">
                    Masukkan PIN khusus Wali Kelas / Pengurus (010189) untuk membuka akses input kehadiran 28 siswa Kelas 9C.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={absenPinInput}
                    onChange={(e) => setAbsenPinInput(e.target.value)}
                    placeholder="Masukkan PIN (010189)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 text-center tracking-widest"
                  />
                  <button
                    onClick={handleUnlockAbsen}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    Buka Kunci
                  </button>
                </div>
              </div>
            ) : (
              /* Unlocked Attendance Table */
              <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-800">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" /> Input Presensi Harian 9C
                    </h2>
                    <p className="text-xs text-slate-400">
                      Pilih tanggal dan centang status kehadiran untuk 28 siswa. Tersimpan otomatis di perangkat.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-sky-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={markAllPresent}
                      className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/40 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Tandai Semua Hadir
                    </button>
                    <button
                      onClick={() => setIsAbsenUnlocked(false)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" /> Kunci Kembali
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Cari nama siswa kelas 9C..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/90 text-slate-200 uppercase font-bold text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4 text-center">Status Kehadiran Tanggal: {selectedDate}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {DAFTAR_SISWA_9C.filter((nama) =>
                        nama.toLowerCase().includes(searchStudent.toLowerCase())
                      ).map((nama, idx) => {
                        const currentStatus =
                          presensiData[selectedDate]?.[nama] || 'Hadir';
                        return (
                          <tr key={nama} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-semibold text-white">{nama}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2 sm:gap-4">
                                {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map((st) => (
                                  <label
                                    key={st}
                                    className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                      currentStatus === st
                                        ? st === 'Hadir'
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : st === 'Izin'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                          : st === 'Sakit'
                                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`absen-${nama}`}
                                      checked={currentStatus === st}
                                      onChange={() => setStudentStatus(nama, st)}
                                      className="hidden"
                                    />
                                    <span>{st}</span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 5. REKAPITULASI KEHADIRAN ================= */}
        {activeTab === 'rekap' && (
          <div className="tab-animating space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" /> Rekapitulasi Kehadiran Real-Time 9C
                  </h2>
                  <p className="text-xs text-slate-400">
                    Statistik akumulatif kehadiran seluruh 28 siswa Kelas 9C MTs Nurul Hidayah Miftahurroja.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={exportCSV}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh CSV (Excel)
                  </button>
                  <button
                    onClick={exportBackupJSON}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-xl border border-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Backup JSON
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/90 text-slate-200 uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4 text-center text-emerald-400">Hadir</th>
                      <th className="py-3 px-4 text-center text-amber-400">Izin</th>
                      <th className="py-3 px-4 text-center text-sky-400">Sakit</th>
                      <th className="py-3 px-4 text-center text-red-400">Alpa</th>
                      <th className="py-3 px-4 text-center text-purple-300">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {DAFTAR_SISWA_9C.map((nama, idx) => {
                      const stat = overallSummary[nama];
                      const pct = stat.totalDays > 0 ? Math.round((stat.Hadir / stat.totalDays) * 100) : 100;
                      return (
                        <tr key={nama} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-semibold text-white">{nama}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-400">{stat.Hadir}</td>
                          <td className="py-3 px-4 text-center font-bold text-amber-400">{stat.Izin}</td>
                          <td className="py-3 px-4 text-center font-bold text-sky-400">{stat.Sakit}</td>
                          <td className="py-3 px-4 text-center font-bold text-red-400">{stat.Alpa}</td>
                          <td className="py-3 px-4 text-center font-bold">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] ${
                                pct >= 85
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : pct >= 70
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. JADWAL PELAJARAN ================= */}
        {activeTab === 'jadwal-mapel' && (
          <div className="tab-animating space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" /> Jadwal Pelajaran Resmi IX C
                  </h2>
                  <p className="text-xs text-slate-400">
                    Kurikulum Terpadu MTs Nurul Hidayah Miftahurroja Tahun Ajaran 2026/2027.
                  </p>
                </div>

                {/* Day Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
                  {(['all', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDayFilter(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                        selectedDayFilter === day
                          ? 'bg-sky-500 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {day === 'all' ? 'Semua Hari' : day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {JADWAL_PELAJARAN_DATA.filter(
                  (d) => selectedDayFilter === 'all' || d.dayKey === selectedDayFilter
                ).map((jadwal) => {
                  const isToday = todayDayName === jadwal.dayKey;
                  return (
                    <div
                      key={jadwal.dayKey}
                      className={`glass-card p-5 rounded-2xl border space-y-4 hover:scale-[1.02] transition-transform ${
                        jadwal.colorBorder
                      } ${isToday ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <h3 className="font-black text-lg text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-400" /> {jadwal.day}
                        </h3>
                        {isToday && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full animate-pulse">
                            HARI INI
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2.5 text-xs">
                        {jadwal.items.map((item, idx) => (
                          <li
                            key={idx}
                            className={`flex justify-between items-center p-2.5 rounded-xl ${
                              item.tipe === 'istirahat'
                                ? 'bg-amber-500/10 text-center justify-center font-bold text-amber-300'
                                : 'bg-slate-900/60'
                            }`}
                          >
                            <span className="text-slate-400">{item.jam}</span>
                            <span className={`font-bold ${item.color}`}>{item.mapel}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. JADWAL PIKET ================= */}
        {activeTab === 'jadwal-piket' && (
          <div className="tab-animating space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-2">
                  <Brush className="w-7 h-7 text-pink-400" /> Jadwal Kebersihan Piket 9C
                </h2>
                <p className="text-xs md:text-sm text-slate-300">
                  Pembagian tugas kebersihan kelas harian 28 siswa Kelas IX C MTs Nurul Hidayah Miftahurroja
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {JADWAL_PIKET_DATA.map((piket) => {
                  const isToday = todayDayName === piket.day.toLowerCase().replace("'", '');
                  return (
                    <div
                      key={piket.day}
                      className={`glass-card p-5 rounded-2xl border border-slate-700/60 space-y-3 hover:scale-[1.02] transition-transform ${
                        isToday ? 'ring-2 ring-pink-400 bg-pink-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                        <h4 className="font-bold text-sky-300 text-sm flex items-center gap-1.5">
                          <Brush className="w-4 h-4 text-pink-400" /> {piket.day}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          {isToday && (
                            <span className="text-[10px] bg-pink-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                              HARI INI
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">
                            {piket.count} Siswa
                          </span>
                        </div>
                      </div>

                      <ul className="text-xs space-y-1.5 text-slate-200">
                        {piket.members.map((nama) => (
                          <li key={nama} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                            <span>{nama}</span>
                          </li>
                        ))}
                      </ul>

                      {piket.note && (
                        <p className="text-[11px] text-amber-300/90 pt-1 italic border-t border-slate-800">
                          {piket.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. LINIMASA 9C ================= */}
        {activeTab === 'linimasa' && (
          <div className="tab-animating space-y-6 max-w-3xl mx-auto">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" /> Linimasa & Pengumuman 9C
                </h2>
                <p className="text-xs text-slate-400">
                  Papan diskusi interaktif siswa-siswi dan bapak Wali Kelas Doni Faturohman, S.Pd.
                </p>
              </div>

              {/* Post Creator Box */}
              <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 space-y-3 shadow-lg">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan pengumuman kelas, salam silaturahmi, atau tanya materi..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all resize-none"
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                    placeholder="Nama Anda (e.g. Alika / Derin / Siswa)..."
                    className="w-full sm:w-60 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={handlePostLinimasa}
                    className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Kirim</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {linimasaPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`glass-card p-4 rounded-2xl border space-y-2 hover:border-indigo-500/40 transition-all ${
                      post.isPinned ? 'border-amber-500/40 bg-amber-950/15' : 'border-slate-700/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-300">{post.author}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                          {post.role}
                        </span>
                        {post.isPinned && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                            📌 PENGUMUMAN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{post.time}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{post.text}</p>

                    <div className="flex items-center gap-4 pt-1">
                      <button
                        onClick={() => likePost(post.id)}
                        className="text-xs text-pink-400 font-semibold flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                        <span>{post.likes} Suka</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. UJIAN TKA (1 JAM / 30 SOAL) ================= */}
        {activeTab === 'tka' && (
          <div className="tab-animating space-y-6">
            {!tkaStarted && !tkaFinished && (
              /* TKA Start Card */
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 text-center max-w-2xl mx-auto border border-amber-500/30 shadow-2xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center text-3xl shadow-lg font-black">
                  <Clock className="w-8 h-8 text-slate-950" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Simulasi Ujian TKA Literasi & Numerasi</h2>
                  <p className="text-xs md:text-sm text-slate-300">
                    Tes Kemampuan Akademik (TKA) resmi persiapan asesmen akhir Kelas 9 MTs Nurul Hidayah Miftahurroja.
                    Alokasi waktu pengerjaan otomatis <strong>60 Menit (1 Jam)</strong> untuk <strong>30 Soal Pilihan Ganda</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-bold">JUMLAH SOAL</span>
                    <span className="text-sm font-bold text-amber-400">30 Butir PG</span>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-bold">DURASI</span>
                    <span className="text-sm font-bold text-sky-400">60 Menit (1 Jam)</span>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-bold">KOMPETENSI</span>
                    <span className="text-xs font-bold text-emerald-400">Literasi & Numerasi</span>
                  </div>
                </div>

                <button
                  onClick={handleStartTKA}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" /> Mulai Ujian TKA Sekarang
                </button>
              </div>
            )}

            {tkaStarted && !tkaFinished && (
              /* Active Exam Screen */
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: Question Box */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-700 shadow-2xl">
                    {/* Header bar with timer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
                      <div>
                        <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                          KATEGORI: {BANK_SOAL_TKA[tkaCurrentIdx].category}
                        </span>
                        <h3 className="text-lg font-black text-white">
                          Soal Nomor {tkaCurrentIdx + 1} Dari 30
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-slate-900 rounded-xl border border-amber-500/40 text-amber-400 font-mono font-bold text-sm flex items-center gap-2 shadow-inner">
                          <Clock className="w-4 h-4 animate-pulse text-amber-400" />
                          <span>
                            {Math.floor(tkaSecondsLeft / 60)
                              .toString()
                              .padStart(2, '0')}
                            :
                            {(tkaSecondsLeft % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="space-y-4">
                      <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                        {BANK_SOAL_TKA[tkaCurrentIdx].question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 pt-2">
                      {BANK_SOAL_TKA[tkaCurrentIdx].options.map((opt, optIdx) => {
                        const isSelected = tkaAnswers[tkaCurrentIdx] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => {
                              const newAns = [...tkaAnswers];
                              newAns[tkaCurrentIdx] = optIdx;
                              setTkaAnswers(newAns);
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-lg'
                                : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <span className="text-xs md:text-sm">{opt}</span>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                      <button
                        disabled={tkaCurrentIdx === 0}
                        onClick={() => setTkaCurrentIdx((p) => Math.max(0, p - 1))}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Sebelumnya
                      </button>

                      {tkaCurrentIdx === 29 ? (
                        <button
                          onClick={handleFinishTKA}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Selesai & Kumpul</span>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setTkaCurrentIdx((p) => Math.min(29, p + 1))}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Selanjutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Number Grid */}
                <div className="space-y-6">
                  <div className="glass-card rounded-3xl p-5 space-y-4 border border-slate-700 shadow-2xl">
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Peta Nomor Soal</span>
                      <span className="text-[10px] text-amber-400">
                        {tkaAnswers.filter((a) => a !== null).length}/30 Terjawab
                      </span>
                    </h4>

                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const isAnswered = tkaAnswers[i] !== null;
                        const isCurrent = i === tkaCurrentIdx;
                        return (
                          <button
                            key={i}
                            onClick={() => setTkaCurrentIdx(i)}
                            className={`py-2 rounded-xl font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg scale-105'
                                : isAnswered
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleFinishTKA}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all hover:scale-105 mt-2 cursor-pointer"
                    >
                      Kirim & Lihat Hasil Ujian
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tkaFinished && (
              /* Results and Review Screen */
              <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-emerald-500/30 text-center max-w-3xl mx-auto shadow-2xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl font-black">
                  <Award className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Hasil Ujian Simulasi TKA 9C</h2>
                  <p className="text-xs text-slate-300">
                    Nilai akhir resmi berdasarkan pengerjaan 30 butir soal Literasi dan Numerasi.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">SKOR AKHIR</span>
                    <span className="text-3xl font-black text-amber-400">{tkaScore.score}</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">BENAR</span>
                    <span className="text-3xl font-black text-emerald-400">{tkaScore.correct}</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">SALAH</span>
                    <span className="text-3xl font-black text-red-400">{tkaScore.wrong}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowTkaPembahasan(!showTkaPembahasan)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    {showTkaPembahasan ? 'Tutup Pembahasan' : 'Lihat Pembahasan Lengkap'}
                  </button>
                  <button
                    onClick={handleStartTKA}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Ulangi Ujian TKA
                  </button>
                </div>

                {showTkaPembahasan && (
                  <div className="text-left mt-6 space-y-4 pt-4 border-t border-slate-800 max-h-[500px] overflow-y-auto pr-2">
                    <h3 className="font-black text-base text-white">Pembahasan Detail 30 Soal TKA:</h3>
                    {BANK_SOAL_TKA.map((q, idx) => {
                      const userAns = tkaAnswers[idx];
                      const isCorrect = userAns === q.answer;
                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'
                          }`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-amber-400">Soal {idx + 1} ({q.category})</span>
                            <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                              {isCorrect ? 'Benar (+1)' : 'Salah'}
                            </span>
                          </div>
                          <p className="text-slate-200 font-medium">{q.question}</p>
                          <div className="space-y-1 text-[11px] text-slate-300">
                            <p>
                              Jawaban Anda:{' '}
                              <strong>
                                {userAns !== null ? q.options[userAns] : 'Tidak dijawab'}
                              </strong>
                            </p>
                            <p className="text-emerald-300 font-bold">
                              Kunci Jawaban: {q.options[q.answer]}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                            <strong>Penjelasan:</strong> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= 10. ZONA GAME ARCADE ================= */}
        {activeTab === 'game' && (
          <div className="tab-animating">
            <ArcadeGames />
          </div>
        )}

        {/* ================= 11. YOUTUBE 9C ================= */}
        {activeTab === 'youtube' && (
          <div className="tab-animating space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-red-500" /> Media Pembelajaran Video Edukasi 9C
                  </h2>
                  <p className="text-xs text-slate-400">
                    Akses materi video pembelajaran IPA, Matematika, Fiqih MTs, dan Murottal merdu untuk mendukung belajar siswa.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ytSearch}
                  onChange={(e) => setYtSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchYouTube()}
                  placeholder="Ketik topik materi (e.g. IPA Kelas 9 Kemagnetan, Fiqih Haji MTs, Al-Qur'an)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-all shadow-inner"
                />
                <button
                  onClick={handleSearchYouTube}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> Cari
                </button>
              </div>

              {/* Preset Shortcuts */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Pintasan Cepat:</span>
                {YOUTUBE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setYtIframeSrc(
                        `https://www.youtube-nocookie.com/embed/results?search_query=${encodeURIComponent(p.query)}`
                      );
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg border border-slate-700 whitespace-nowrap transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Responsive Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                <iframe
                  className="w-full h-full"
                  src={ytIframeSrc}
                  title="YouTube Player Pembelajaran IX C"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= ADMIN AUTH MODAL ================= */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-5 border border-indigo-500/40 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-black">
                <Shield className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Login Wali Kelas</h3>
              <p className="text-xs text-slate-300">
                Masukkan PIN Wali Kelas (010189) untuk mengakses penuh pengeditan presensi dan manajemen kelas 9C.
              </p>
            </div>

            <input
              type="password"
              value={adminPinInput}
              onChange={(e) => setAdminPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyAdmin()}
              placeholder="Masukkan PIN (010189)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400 text-center tracking-widest"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminPinInput('');
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleVerifyAdmin}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="glass-nav mt-8 py-5 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          Website Resmi Kelas IX C & Guru AI MTs Nurul Hidayah Miftahurroja
        </p>
        <p className="text-[11px]">
          Tahun Ajaran 2026/2027 • Wali Kelas: Doni Faturohman, S.Pd. • Mengedepankan Prestasi & Akhlakul Karimah
        </p>
      </footer>
    </div>
  );
}
