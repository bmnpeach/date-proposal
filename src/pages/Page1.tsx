import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Page1Props {
  onYes: () => void
}

const CARD_PADDING = 32

function getRandomPosition(cardWidth: number, cardHeight: number, btnWidth: number, btnHeight: number) {
  const maxX = cardWidth - CARD_PADDING * 2 - btnWidth
  const maxY = cardHeight - CARD_PADDING * 2 - btnHeight
  return {
    x: Math.max(0, Math.random() * maxX),
    y: Math.max(0, Math.random() * maxY),
  }
}

export default function Page1({ onYes }: Page1Props) {
  const [dodgeCount, setDodgeCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isTouchDevice] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const noBtnRef = useRef<HTMLButtonElement>(null)

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current

  const handleDodge = useCallback(() => {
    if (isDisabled) return

    const card = cardRef.current
    const btn = noBtnRef.current
    if (!card || !btn) return

    const cardRect = card.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()

    const btnWidth = btnRect.width
    const btnHeight = btnRect.height

    const pos = getRandomPosition(cardRect.width, cardRect.height, btnWidth, btnHeight)
    setNoPosition(pos)

    if (dodgeCount >= 3) {
      setIsDisabled(true)
    }

    setDodgeCount(prev => prev + 1)
  }, [dodgeCount, isDisabled])

  const handleNoMouseEnter = useCallback(() => {
    if (isTouchDevice) return
    handleDodge()
  }, [handleDodge, isTouchDevice])

  const handleNoTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleDodge()
  }, [handleDodge])

  const handleYesClick = useCallback(() => {
    if (prefersReducedMotion) {
      onYes()
      return
    }
    setIsFadingOut(true)
    setTimeout(() => {
      onYes()
    }, 500)
  }, [onYes, prefersReducedMotion])

  const handleNoClick = useCallback(() => {
    if (isDisabled) {
      handleYesClick()
    }
  }, [isDisabled, handleYesClick])

  return (
    <div
      className="min-h-screen bg-[#FDF2F8] flex items-center justify-center p-4"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-white rounded-[24px] shadow-[0_8px_32px_rgba(219,39,119,0.12)] max-w-[420px] w-full flex flex-col items-center justify-center overflow-hidden select-none"
        style={{
          padding: CARD_PADDING,
          minHeight: 420,
          position: 'relative',
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          <motion.div
            key="content"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
              <motion.span
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                className="text-4xl sm:text-5xl"
                style={prefersReducedMotion ? { animation: 'none' } : {}}
              >
                🌸
              </motion.span>
              <h1
                className="text-2xl sm:text-3xl text-[#DB2777] text-center"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                Hi Shawarma, will you go on a date with me?
              </h1>
              <motion.span
                animate={{ rotate: [5, -5, 5] }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                className="text-4xl sm:text-5xl"
                style={prefersReducedMotion ? { animation: 'none' } : {}}
              >
                🌸
              </motion.span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full px-2">
              <motion.button
                onClick={handleYesClick}
                whileHover={!prefersReducedMotion ? { scale: 1.04 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full sm:w-auto rounded-[16px] px-8 py-3 text-white font-semibold text-lg cursor-pointer border-none outline-none"
                style={{
                  backgroundColor: '#DB2777',
                  boxShadow: '0 4px 16px rgba(219, 39, 119, 0.3)',
                }}
              >
                Yes! ❤️
              </motion.button>

              <motion.button
                ref={noBtnRef}
                onClick={handleNoClick}
                onMouseEnter={handleNoMouseEnter}
                onTouchStart={handleNoTouchStart}
                style={{
                  position: 'absolute',
                  left: noPosition.x + CARD_PADDING,
                  top: noPosition.y + CARD_PADDING,
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isDisabled ? 'pointer' : 'pointer',
                  transition: prefersReducedMotion ? 'none' : 'left 300ms ease, top 300ms ease',
                  opacity: dodgeCount > 0 && !isDisabled ? 0.8 : 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
                animate={
                  !prefersReducedMotion && dodgeCount > 0 && !isDisabled
                    ? {
                        scale: [1, 0.95, 1],
                        rotate: [0, -2, 2, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                disabled={isDisabled}
              >
                No 😢
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
