import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface Page3Props {
  onConfirm: (food: string) => void;
}

const foodOptions = [
  { emoji: "🍕", name: "Pizza", color: "#FEE2E2" },
  { emoji: "🍔", name: "Burger", color: "#FEF3C7" },
  { emoji: "🍣", name: "Sushi", color: "#DBEAFE" },
  { emoji: "🌮", name: "Tacos", color: "#D1FAE5" },
  { emoji: "🍝", name: "Pasta", color: "#FDE68A" },
  { emoji: "🥗", name: "Salad", color: "#CFFAFE" },
];

export default function Page3({ onConfirm }: Page3Props) {
  const [selectedFood, setSelectedFood] = useState<number | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const handleConfirm = useCallback(() => {
    if (selectedFood === null) return;
    if (prefersReducedMotion) {
      onConfirm(foodOptions[selectedFood].name);
      return;
    }
    setIsFadingOut(true);
    setTimeout(() => onConfirm(foodOptions[selectedFood].name), 500);
  }, [selectedFood, onConfirm, prefersReducedMotion]);

  return (
    <div
      className="min-h-screen bg-[#FDF2F8] flex items-center justify-center p-4"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white rounded-[24px] shadow-[0_8px_32px_rgba(219,39,119,0.12)] max-w-[420px] w-full flex flex-col items-center overflow-hidden select-none"
        style={{ padding: 32 }}
      >
        <AnimatePresence>
          <motion.div
            key="content"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            <h1
              className="text-2xl sm:text-3xl text-[#DB2777] text-center mb-2"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              What should we eat?
            </h1>
            <p className="text-[#831843] font-semibold text-base mb-6">
              Pick your favorite
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
              {foodOptions.map((food, index) => {
                const isSelected = selectedFood === index;
                return (
                  <motion.button
                    key={food.name}
                    onClick={() => setSelectedFood(index)}
                    whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                    whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                    className={`
                      rounded-[20px] p-4 sm:p-6 flex flex-col items-center gap-2
                      transition-all duration-200 cursor-pointer border-2
                      ${
                        isSelected
                          ? "border-[#DB2777] shadow-[0_4px_16px_rgba(219,39,119,0.3)]"
                          : "border-[#FBCFE8] bg-white"
                      }
                    `}
                    style={{
                      backgroundColor: isSelected ? food.color : "white",
                    }}
                  >
                    <span className="text-4xl sm:text-5xl">{food.emoji}</span>
                    <span
                      className={`
                        font-semibold text-sm sm:text-base
                        ${isSelected ? "text-[#DB2777]" : "text-[#831843]"}
                      `}
                    >
                      {food.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={handleConfirm}
              disabled={selectedFood === null}
              whileHover={
                !prefersReducedMotion && selectedFood !== null
                  ? { scale: 1.04 }
                  : {}
              }
              whileTap={
                !prefersReducedMotion && selectedFood !== null
                  ? { scale: 0.98 }
                  : {}
              }
              className={`
                w-full rounded-[16px] px-8 py-3 text-white font-semibold text-lg
                flex items-center justify-center gap-2 border-none cursor-pointer
                transition-all duration-300
                ${
                  selectedFood !== null
                    ? "bg-[#DB2777] shadow-[0_4px_16px_rgba(219,39,119,0.3)]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }
              `}
              style={
                selectedFood !== null
                  ? {
                      animation: prefersReducedMotion
                        ? "none"
                        : "heartPulse 1.5s ease-in-out infinite",
                    }
                  : {}
              }
            >
              <Heart
                size={18}
                fill={selectedFood !== null ? "white" : "none"}
                stroke={selectedFood !== null ? "white" : "#9CA3AF"}
              />
              Confirm food
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
