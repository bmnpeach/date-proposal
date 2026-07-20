import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Page4Props {
  date: Date;
  time: string;
  food: string;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function sendTelegramNotification(date: Date, time: string, food: string) {
  const BOT_TOKEN = "8444485075:AAFpDNX2x7OrT8Kec15Bw5Ny8LJTI8U8aBs";
  const CHAT_ID = "8785171322";

  const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
  const message = `🌸 *Date Confirmed!* 🌸\n\n📅 Date: ${formattedDate}\n⏰ Time: ${time}\n🍽️ Food: ${food}\n\nShe said YES! 💕`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  }).catch((err) => console.error("Telegram send failed:", err));
}

export default function Page4({ date, time, food }: Page4Props) {
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const handleSend = useCallback(() => {
    sendTelegramNotification(date, time, food);
  }, [date, time, food]);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    color: ["#DB2777", "#F472B6", "#FBCFE8", "#F9A8D4", "#FDF2F8", "#FFD700"][
      Math.floor(Math.random() * 6)
    ],
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  const emojis = ["💕", "🌸", "✨", "💖", "🥰", "💗", "🎉", "💝"];

  return (
    <div
      className="min-h-screen bg-[#FDF2F8] flex items-center justify-center p-4 overflow-hidden relative"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: -20,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
            }}
            animate={{
              top: ["-20px", "110vh"],
              rotate: [0, 360],
              x: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {emojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white rounded-[24px] shadow-[0_8px_32px_rgba(219,39,119,0.12)] max-w-[420px] w-full flex flex-col items-center overflow-hidden select-none"
        style={{ padding: 32 }}
      >
        {/* YAY header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h1
            className="text-4xl sm:text-5xl text-[#DB2777] text-center mb-2"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            YAY!
          </h1>
          <p className="text-[#831843] font-semibold text-base mb-6">
            She said YES! 🎉
          </p>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full space-y-4 mb-6"
        >
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FBCFE8]">
            <Heart size={20} className="text-[#DB2777]" fill="#DB2777" />
            <div>
              <p className="text-xs text-[#831843] font-semibold">Date</p>
              <p className="text-[#DB2777] font-bold">
                {monthNames[date.getMonth()]} {date.getDate()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FDE68A]">
            <span className="text-xl">⏰</span>
            <div>
              <p className="text-xs text-[#831843] font-semibold">Time</p>
              <p className="text-[#831843] font-bold">{time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#DBEAFE]">
            <span className="text-xl">🍽️</span>
            <div>
              <p className="text-xs text-[#831843] font-semibold">Food</p>
              <p className="text-[#DB2777] font-bold">{food}</p>
            </div>
          </div>
        </motion.div>

        {/* Send button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={!prefersReducedMotion ? { scale: 1.04 } : {}}
          whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
          onClick={handleSend}
          className="w-full rounded-[16px] px-8 py-3 text-white font-semibold text-lg flex items-center justify-center gap-2 border-none cursor-pointer"
          style={{
            backgroundColor: "#DB2777",
            boxShadow: "0 4px 16px rgba(219, 39, 119, 0.3)",
          }}
        >
          <Heart size={18} fill="white" stroke="white" />
          Send confirmation
        </motion.button>
      </motion.div>
    </div>
  );
}
