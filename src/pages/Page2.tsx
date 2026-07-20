import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface Page2Props {
  onConfirm: (date: Date, time: string) => void;
}

interface DayInfo {
  date: Date;
  day: number;
  isToday: boolean;
  isPast: boolean;
  isOtherMonth: boolean;
}

function generateCalendarDays(): { month: number; year: number; days: DayInfo[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const months: { month: number; year: number; days: DayInfo[] }[] = [];

  for (let m = 0; m < 2; m++) {
    const firstDay = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + m + 1, 0);
    const days: DayInfo[] = [];

    const startPadding = firstDay.getDay();
    const prevMonthLast = new Date(today.getFullYear(), today.getMonth() + m - 1, 0);

    for (let i = startPadding - 1; i >= 0; i--) {
      const d = prevMonthLast.getDate() - i;
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), d - startPadding + 1);
      days.push({ date, day: d, isToday: false, isPast: true, isOtherMonth: true });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), d);
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      days.push({ date, day: d, isToday, isPast, isOtherMonth: false });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(firstDay.getFullYear(), firstDay.getMonth() + m, d);
      days.push({ date, day: d, isToday: false, isPast: false, isOtherMonth: true });
    }

    months.push({ month: firstDay.getMonth(), year: firstDay.getFullYear(), days });
  }

  return months;
}

const timeSlots = (() => {
  const slots: string[] = [];
  for (let h = 8; h <= 22; h++) {
    for (const min of ["00", "30"]) {
      if (h === 22 && min === "30") continue;
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h > 12 ? h - 12 : h;
      slots.push(`${hour12}:${min} ${period}`);
    }
  }
  return slots;
})();

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Page2({ onConfirm }: Page2Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [calendarData] = useState(generateCalendarDays);
  const timeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ).current;

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setTimeout(() => {
        timeRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }, 100);
    },
    [prefersReducedMotion]
  );

  const handleConfirm = useCallback(() => {
    if (!selectedDate || !selectedTime) return;
    if (prefersReducedMotion) {
      onConfirm(selectedDate, selectedTime);
      return;
    }
    setIsFadingOut(true);
    setTimeout(() => onConfirm(selectedDate, selectedTime), 500);
  }, [selectedDate, selectedTime, onConfirm, prefersReducedMotion]);

  const formattedDate = selectedDate
    ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
    : "";

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
              So so... When are you free?
            </h1>
            <p className="text-[#831843] font-semibold text-base mb-6">Pick a day</p>

            <div className="w-full mb-6">
              {calendarData.map((month, mi) => (
                <div key={mi} className="mb-4 last:mb-0">
                  <p className="text-sm font-bold text-[#DB2777] mb-2 text-center">
                    {monthNames[month.month]} {month.year}
                  </p>
                  <div className="grid grid-cols-7 gap-1">
                    {dayNames.map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-bold text-[#9CA3AF] py-1"
                      >
                        {d}
                      </div>
                    ))}
                    {month.days.map((dayInfo, di) => {
                      const isSelected =
                        selectedDate?.getTime() === dayInfo.date.getTime();
                      return (
                        <motion.button
                          key={di}
                          onClick={() => !dayInfo.isPast && handleDateSelect(dayInfo.date)}
                          whileHover={!dayInfo.isPast ? { scale: 1.05 } : {}}
                          whileTap={!dayInfo.isPast ? { scale: 0.95 } : {}}
                          disabled={dayInfo.isPast}
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                            transition-all duration-200 cursor-pointer
                            ${
                              dayInfo.isPast
                                ? "text-[#D1D5DB] cursor-not-allowed"
                                : isSelected
                                ? "bg-[#DB2777] text-white"
                                : dayInfo.isToday
                                ? "border-2 border-dashed border-[#FBCFE8] text-[#DB2777]"
                                : "bg-white border border-[#FBCFE8] text-[#831843]"
                            }
                            ${dayInfo.isOtherMonth ? "opacity-40" : ""}
                          `}
                        >
                          {dayInfo.day}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-2 rounded-full bg-[#FBCFE8] text-[#DB2777] font-semibold text-sm"
              >
                {formattedDate}
              </motion.div>
            )}

            <div ref={timeRef} className="w-full">
              {selectedDate && (
                <>
                  <p className="text-sm font-bold text-[#831843] mb-3 text-center">
                    Pick a time
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                          whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                          className={`
                            py-2 px-1 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${
                              isSelected
                                ? "bg-[#DB2777] text-white shadow-[0_4px_12px_rgba(219,39,119,0.3)]"
                                : "bg-white border border-[#FBCFE8] text-[#831843]"
                            }
                          `}
                        >
                          {time}
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <motion.button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              whileHover={
                !prefersReducedMotion && selectedDate && selectedTime
                  ? { scale: 1.04 }
                  : {}
              }
              whileTap={
                !prefersReducedMotion && selectedDate && selectedTime
                  ? { scale: 0.98 }
                  : {}
              }
              className={`
                w-full rounded-[16px] px-8 py-3 text-white font-semibold text-lg
                flex items-center justify-center gap-2 border-none cursor-pointer
                transition-all duration-300
                ${
                  selectedDate && selectedTime
                    ? "bg-[#DB2777] shadow-[0_4px_16px_rgba(219,39,119,0.3)]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }
              `}
              style={
                selectedDate && selectedTime
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
                fill={selectedDate && selectedTime ? "white" : "none"}
                stroke={selectedDate && selectedTime ? "white" : "#9CA3AF"}
              />
              Set the date
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
