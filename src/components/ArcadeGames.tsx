import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, Play, Trophy, Sparkles, Key, DoorOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ArcadeGames() {
  const [activeGame, setActiveGame] = useState<'puzzle' | 'tetris' | 'mario' | 'dungeon'>('puzzle');

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
            <Gamepad2 className="w-6 h-6 text-amber-400" />
            Zona Game Arcade Edukatif 9C
          </h2>
          <p className="text-xs text-slate-300">
            Asah ketangkasan, logika, dan relaksasi sehat saat jam istirahat sekolah siswa IX C.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
          <button
            onClick={() => setActiveGame('puzzle')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeGame === 'puzzle'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧩 Slide Puzzle
          </button>
          <button
            onClick={() => setActiveGame('tetris')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeGame === 'tetris'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧱 Tetris Retro
          </button>
          <button
            onClick={() => setActiveGame('mario')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeGame === 'mario'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🍄 Mario Runner
          </button>
          <button
            onClick={() => setActiveGame('dungeon')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeGame === 'dungeon'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🗡️ Dungeon Quest
          </button>
        </div>
      </div>

      {activeGame === 'puzzle' && <SlidePuzzleGame />}
      {activeGame === 'tetris' && <TetrisGame />}
      {activeGame === 'mario' && <MarioRunnerGame />}
      {activeGame === 'dungeon' && <DungeonAdventureGame />}
    </div>
  );
}

// ===================== 1. SLIDE PUZZLE =====================
function SlidePuzzleGame() {
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const shuffle = () => {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // Solvable shuffle
    for (let i = 0; i < 60; i++) {
      const emptyIdx = arr.indexOf(0);
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const neighbors: number[] = [];
      if (row > 0) neighbors.push(emptyIdx - 3);
      if (row < 2) neighbors.push(emptyIdx + 3);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < 2) neighbors.push(emptyIdx + 1);
      const randMove = neighbors[Math.floor(Math.random() * neighbors.length)];
      arr[emptyIdx] = arr[randMove];
      arr[randMove] = 0;
    }
    setTiles(arr);
    setMoves(0);
    setHasWon(false);
  };

  useEffect(() => {
    shuffle();
  }, []);

  const moveTile = (idx: number) => {
    if (hasWon) return;
    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const emptyRow = Math.floor(emptyIdx / 3);
    const emptyCol = emptyIdx % 3;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      newTiles[emptyIdx] = newTiles[idx];
      newTiles[idx] = 0;
      setTiles(newTiles);
      const newMoves = moves + 1;
      setMoves(newMoves);

      // Check win
      const won = newTiles.every((val, i) => (i === 8 ? val === 0 : val === i + 1));
      if (won) {
        setHasWon(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60">
        <span>Langkah: <strong className="text-amber-400 font-bold text-sm">{moves}</strong></span>
        <button
          onClick={shuffle}
          className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Acak Ulang
        </button>
      </div>

      {hasWon && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-center text-xs font-bold">
          🎉 Masya Allah! Kamu berhasil menyelesaikan puzzle 9C dalam {moves} langkah!
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5 bg-slate-900 p-3 rounded-2xl border border-slate-700 aspect-square shadow-xl">
        {tiles.map((num, idx) => (
          <button
            key={idx}
            onClick={() => moveTile(idx)}
            className={`rounded-xl font-black text-2xl transition-all duration-150 flex items-center justify-center select-none ${
              num === 0
                ? 'bg-slate-800/40'
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md hover:scale-95 active:scale-90'
            }`}
          >
            {num === 0 ? '' : num}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 text-center">
        Geser angka hingga berurutan dari 1 sampai 8 untuk menyelesaikan tantangan.
      </p>
    </div>
  );
}

// ===================== 2. TETRIS RETRO =====================
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 18;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = [
  '#38bdf8', // sky
  '#facc15', // yellow
  '#c084fc', // purple
  '#fb923c', // orange
  '#60a5fa', // blue
  '#4ade80', // green
  '#f87171', // red
];

function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameState = useRef<{
    board: (string | null)[][];
    currentPiece: { shape: number[][]; color: string; x: number; y: number } | null;
    timer: any;
    score: number;
    lines: number;
  }>({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    currentPiece: null,
    timer: null,
    score: 0,
    lines: 0,
  });

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const color = COLORS[idx];
    const x = Math.floor((COLS - shape[0].length) / 2);
    const y = 0;

    // Check collision on spawn
    if (checkCollision(shape, x, y, gameState.current.board)) {
      setGameOver(true);
      setIsPlaying(false);
      clearInterval(gameState.current.timer);
      return false;
    }

    gameState.current.currentPiece = { shape, color, x, y };
    return true;
  };

  const checkCollision = (shape: number[][], posX: number, posY: number, board: (string | null)[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = posX + c;
          const newY = posY + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && board[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const { currentPiece, board } = gameState.current;
    if (!currentPiece) return;

    currentPiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const by = currentPiece.y + r;
          const bx = currentPiece.x + c;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
            board[by][bx] = currentPiece.color;
          }
        }
      });
    });

    // Check cleared lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell !== null)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      gameState.current.lines += cleared;
      gameState.current.score += cleared * 100 * (cleared === 4 ? 2 : 1);
      setLines(gameState.current.lines);
      setScore(gameState.current.score);
    }

    spawnPiece();
  };

  const tick = () => {
    const { currentPiece, board } = gameState.current;
    if (!currentPiece) return;

    if (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1, board)) {
      currentPiece.y++;
    } else {
      mergePiece();
    }
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0b132b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    const { board, currentPiece } = gameState.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          ctx.fillStyle = board[r][c]!;
          ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        } else {
          ctx.strokeStyle = '#1e293b';
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Draw active piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            ctx.fillRect(
              (currentPiece.x + c) * BLOCK_SIZE,
              (currentPiece.y + r) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1
            );
          }
        });
      });
    }
  };

  const startGame = () => {
    clearInterval(gameState.current.timer);
    gameState.current.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    gameState.current.score = 0;
    gameState.current.lines = 0;
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsPlaying(true);
    spawnPiece();
    gameState.current.timer = setInterval(tick, 500);
    draw();
  };

  const move = (dir: -1 | 1) => {
    if (!isPlaying || gameOver) return;
    const { currentPiece, board } = gameState.current;
    if (!currentPiece) return;
    if (!checkCollision(currentPiece.shape, currentPiece.x + dir, currentPiece.y, board)) {
      currentPiece.x += dir;
      draw();
    }
  };

  const drop = () => {
    if (!isPlaying || gameOver) return;
    const { currentPiece, board } = gameState.current;
    if (!currentPiece) return;
    while (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1, board)) {
      currentPiece.y++;
    }
    mergePiece();
    draw();
  };

  const rotate = () => {
    if (!isPlaying || gameOver) return;
    const { currentPiece, board } = gameState.current;
    if (!currentPiece) return;

    // Transpose and reverse
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map((row) => row[i]).reverse()
    );

    if (!checkCollision(rotated, currentPiece.x, currentPiece.y, board)) {
      currentPiece.shape = rotated;
      draw();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(gameState.current.timer);
    };
  }, []);

  return (
    <div className="max-w-xs mx-auto space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60">
        <div>
          <span>Skor: <strong className="text-sky-400 font-bold text-sm">{score}</strong></span>
          <span className="ml-3 text-slate-400">Baris: {lines}</span>
        </div>
        <button
          onClick={startGame}
          className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Play className="w-3.5 h-3.5" /> {isPlaying ? 'Mulai Ulang' : 'Mainkan'}
        </button>
      </div>

      <div className="relative mx-auto w-fit">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="bg-slate-950 rounded-2xl border-2 border-sky-500/40 shadow-2xl block mx-auto"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 rounded-2xl text-center space-y-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <h4 className="text-sm font-black text-white">GAME OVER!</h4>
            <p className="text-xs text-slate-300">Skor Akhir: {score}</p>
            <button
              onClick={startGame}
              className="mt-2 px-4 py-2 bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => move(-1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={rotate}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => move(1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white flex items-center justify-center font-bold"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={drop}
          className="p-3 bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-xl text-slate-950 flex items-center justify-center font-bold"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===================== 3. MARIO RUNNER =====================
function MarioRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDead, setIsDead] = useState(false);

  const state = useRef({
    heroY: 120,
    heroVy: 0,
    isJumping: false,
    obstacles: [] as { x: number; width: number; height: number }[],
    score: 0,
    animFrame: 0,
  });

  const jump = () => {
    if (!isPlaying) {
      start();
      return;
    }
    if (!state.current.isJumping) {
      state.current.heroVy = -11;
      state.current.isJumping = true;
    }
  };

  const start = () => {
    state.current = {
      heroY: 120,
      heroVy: 0,
      isJumping: false,
      obstacles: [{ x: 380, width: 18, height: 28 }],
      score: 0,
      animFrame: 0,
    };
    setScore(0);
    setIsDead(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;
      if (isPlaying && !isDead) {
        // Physics
        state.current.heroY += state.current.heroVy;
        state.current.heroVy += 0.65; // Gravity

        if (state.current.heroY >= 120) {
          state.current.heroY = 120;
          state.current.heroVy = 0;
          state.current.isJumping = false;
        }

        // Obstacles move
        state.current.obstacles.forEach((obs) => {
          obs.x -= 4.5;
        });

        // Add new obstacle
        const lastObs = state.current.obstacles[state.current.obstacles.length - 1];
        if (lastObs && lastObs.x < 220 && Math.random() < 0.03) {
          state.current.obstacles.push({
            x: 380,
            width: 16 + Math.random() * 8,
            height: 22 + Math.random() * 14,
          });
        }

        // Remove offscreen
        state.current.obstacles = state.current.obstacles.filter((obs) => obs.x > -30);

        // Score
        state.current.score++;
        if (state.current.score % 10 === 0) {
          setScore(Math.floor(state.current.score / 10));
        }

        // Collision check
        const heroX = 40;
        const heroW = 20;
        const heroH = 26;
        const hY = state.current.heroY;

        for (const obs of state.current.obstacles) {
          if (
            heroX < obs.x + obs.width &&
            heroX + heroW > obs.x &&
            hY + heroH > 150 - obs.height
          ) {
            setIsDead(true);
            setIsPlaying(false);
          }
        }
      }

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Ground
          ctx.fillStyle = '#10b981';
          ctx.fillRect(0, 146, canvas.width, 34);

          // Hero
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(40, state.current.heroY, 20, 26);
          // Hero eyes & headband
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(52, state.current.heroY + 4, 5, 5);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(40, state.current.heroY + 2, 20, 4);

          // Obstacles (pipes / cactus)
          ctx.fillStyle = '#06b6d4';
          state.current.obstacles.forEach((obs) => {
            ctx.fillRect(obs.x, 150 - obs.height, obs.width, obs.height);
          });
        }
      }

      state.current.animFrame = requestAnimationFrame(loop);
    };

    state.current.animFrame = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(state.current.animFrame);
    };
  }, [isPlaying, isDead]);

  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60">
        <span>Jarak Lari: <strong className="text-emerald-400 font-bold text-sm">{score} m</strong></span>
        <button
          onClick={start}
          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Play className="w-3.5 h-3.5" /> {isPlaying ? 'Mulai Ulang' : 'Mainkan'}
        </button>
      </div>

      <div className="relative mx-auto w-fit">
        <canvas
          ref={canvasRef}
          width={360}
          height={180}
          onClick={jump}
          className="bg-slate-950 rounded-2xl border-2 border-emerald-500/40 shadow-2xl block mx-auto cursor-pointer"
        />
        {isDead && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 rounded-2xl text-center space-y-2">
            <h4 className="text-base font-black text-red-400">KAMU MENABRAK!</h4>
            <p className="text-xs text-slate-300">Total Skor: {score} meter</p>
            <button
              onClick={start}
              className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Lari Lagi 🍄
            </button>
          </div>
        )}
      </div>

      <button
        onClick={jump}
        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg active:scale-98 transition-all"
      >
        LOMPAT! 🚀 (Klik atau Tap di sini)
      </button>
    </div>
  );
}

// ===================== 4. DUNGEON PETUALANGAN =====================
const D_SIZE = 7;

function DungeonAdventureGame() {
  const [heroPos, setHeroPos] = useState({ r: 0, c: 0 });
  const [keyPos, setKeyPos] = useState({ r: 3, c: 3 });
  const [doorPos, setDoorPos] = useState({ r: 6, c: 6 });
  const [hasKey, setHasKey] = useState(false);
  const [traps, setTraps] = useState<{ r: number; c: number }[]>([]);
  const [coins, setCoins] = useState<{ r: number; c: number }[]>([]);
  const [coinCount, setCoinCount] = useState(0);
  const [status, setStatus] = useState('Temukan Kunci 🗝️ lalu masuki Pintu Keluar 🚪!');
  const [won, setWon] = useState(false);

  const resetDungeon = () => {
    setHeroPos({ r: 0, c: 0 });
    setKeyPos({ r: Math.floor(Math.random() * 3) + 2, c: Math.floor(Math.random() * 3) + 2 });
    setDoorPos({ r: 6, c: 6 });
    setHasKey(false);
    setCoinCount(0);
    setWon(false);

    // Random traps
    const newTraps: { r: number; c: number }[] = [];
    while (newTraps.length < 5) {
      const r = Math.floor(Math.random() * 7);
      const c = Math.floor(Math.random() * 7);
      if (!(r === 0 && c === 0) && !(r === 6 && c === 6)) {
        newTraps.push({ r, c });
      }
    }
    setTraps(newTraps);

    // Random coins
    const newCoins: { r: number; c: number }[] = [];
    while (newCoins.length < 4) {
      const r = Math.floor(Math.random() * 7);
      const c = Math.floor(Math.random() * 7);
      if (!(r === 0 && c === 0) && !(r === 6 && c === 6)) {
        newCoins.push({ r, c });
      }
    }
    setCoins(newCoins);
    setStatus('Temukan Kunci 🗝️ lalu masuki Pintu Keluar 🚪!');
  };

  useEffect(() => {
    resetDungeon();
  }, []);

  const moveHero = (dr: number, dc: number) => {
    if (won) return;
    const nr = heroPos.r + dr;
    const nc = heroPos.c + dc;
    if (nr < 0 || nr >= D_SIZE || nc < 0 || nc >= D_SIZE) return;

    // Check trap
    if (traps.some((t) => t.r === nr && t.c === nc)) {
      setStatus('💥 Waduh! Terkena jebakan slime! Posisi di-reset ke awal.');
      setHeroPos({ r: 0, c: 0 });
      return;
    }

    setHeroPos({ r: nr, c: nc });

    // Check coin
    if (coins.some((c) => c.r === nr && c.c === nc)) {
      setCoins(coins.filter((c) => !(c.r === nr && c.c === nc)));
      setCoinCount((prev) => prev + 10);
      setStatus('🪙 Koin emas diambil! +10 Poin');
    }

    // Check key
    if (!hasKey && nr === keyPos.r && nc === keyPos.c) {
      setHasKey(true);
      setStatus('🗝️ Hebat! Kunci pintu didapatkan! Segera tuju Pintu Keluar 🚪.');
    }

    // Check door
    if (nr === doorPos.r && nc === doorPos.c) {
      if (hasKey) {
        setWon(true);
        setStatus('🎉 Alhamdulillaah! Kamu berhasil menyelesaikan Petualangan Dungeon!');
        confetti({ particleCount: 70, spread: 60 });
      } else {
        setStatus('🔒 Pintu terkunci! Kamu harus mencari kunci 🗝️ terlebih dahulu.');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4 text-center">
      <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60">
        <span>Koin: <strong className="text-amber-400 font-bold">{coinCount}</strong></span>
        <span className="text-[11px] text-purple-300 flex items-center gap-1">
          {hasKey ? 'Kunci: ✅' : 'Kunci: ❌'}
        </span>
        <button
          onClick={resetDungeon}
          className="px-3 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-xl text-xs font-bold"
        >
          Reset Peta
        </button>
      </div>

      <div className="text-xs font-semibold text-purple-200 bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-xl">
        {status}
      </div>

      {/* Grid 7x7 */}
      <div className="grid grid-cols-7 gap-1.5 bg-slate-950 p-3 rounded-2xl border border-purple-500/40 aspect-square shadow-xl">
        {Array.from({ length: D_SIZE * D_SIZE }).map((_, idx) => {
          const r = Math.floor(idx / D_SIZE);
          const c = idx % D_SIZE;
          const isHero = heroPos.r === r && heroPos.c === c;
          const isKey = !hasKey && keyPos.r === r && keyPos.c === c;
          const isDoor = doorPos.r === r && doorPos.c === c;
          const isCoin = coins.some((cn) => cn.r === r && cn.c === c);
          const isTrap = traps.some((t) => t.r === r && t.c === c);

          return (
            <div
              key={idx}
              className={`rounded-xl flex items-center justify-center text-base transition-all select-none ${
                isHero
                  ? 'bg-amber-400 ring-2 ring-white scale-105'
                  : isDoor
                  ? 'bg-indigo-900/70 border border-indigo-400'
                  : isTrap
                  ? 'bg-rose-950/30'
                  : 'bg-slate-900/60'
              }`}
            >
              {isHero ? '🧙‍♂️' : isKey ? '🗝️' : isDoor ? '🚪' : isCoin ? '🪙' : isTrap ? '👾' : ''}
            </div>
          );
        })}
      </div>

      {/* D-Pad Buttons */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto pt-1">
        <div />
        <button
          onClick={() => moveHero(-1, 0)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white font-bold"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => moveHero(0, -1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white font-bold"
        >
          ◀
        </button>
        <button
          onClick={() => moveHero(1, 0)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white font-bold"
        >
          ▼
        </button>
        <button
          onClick={() => moveHero(0, 1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl text-white font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
