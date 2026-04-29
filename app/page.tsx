'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Sparkles, Sun, Sunset, Waves, ArrowDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import StarBackground from './components/StarBackground'

const ZodiacFlash = dynamic(() => import('./components/ZodiacFlash'), { ssr: false })

interface SurveyStep {
  id: string | number
  type?: 'intro' | 'card-pick'
  title?: string
  subtitle?: string
  btn?: string
  q?: string
  layout?: string
  options?: string[]
}

interface Result {
  title: string
  icon: React.ReactNode
  color: string
  message: string
  glow: string
  description: string
}

const steps: SurveyStep[] = [
  {
    id: 'intro',
    type: 'intro',
    title: '별의 궤적을 따라\n미래의 속삭임을 마주해볼까요?',
    subtitle: '당신의 이야기를 새로운 카드로 만들어갑니다',
    btn: 'Click',
  },
  {
    id: 1,
    q: '별들이 말하는 영적인 힘을 믿으시나요?',
    layout: 'grid-cols-1',
    options: ['보이지 않는 힘이 있다고 믿는다', '믿지는 않지만 알고 싶다', '믿지 않는다'],
  },
  {
    id: 2,
    q: '당신의 별은 어디에 위치하고 있나요?',
    layout: 'grid-cols-3',
    options: ['양', '황소', '쌍둥이', '게', '사자', '처녀', '천칭', '전갈', '사수', '염소', '물병', '물고기'].map(n => `${n}자리`),
  },
  {
    id: 3,
    q: '당신의 마음은 어떤 모양인가요?',
    layout: 'grid-cols-4',
    options: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
  },
  {
    id: 4,
    q: '지금 당신이 듣고 싶은 삶의 영역은 어떤 것인가요?',
    layout: 'grid-cols-2',
    options: ['연애와 인연', '일과 성공', '금전과 풍요', '자아와 성찰'],
  },
  {
    id: 5,
    type: 'card-pick',
    q: '당신의 내일을 비춰줄 카드를 골라주세요',
  },
]

const results: Result[] = [
  {
    title: '태양이 밝게 빛나는 하늘',
    icon: <Sun className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" />,
    color: 'from-orange-500 via-yellow-400 to-amber-200',
    message: '눈부신 빛이 당신의 앞날을 환히 밝혀줄 것입니다. 새로운 시작을 두려워하지 마세요.',
    glow: 'shadow-amber-400/30',
    description: '태양 카드는 생명력과 자신감, 새로운 출발을 상징합니다. 두려움 없이 앞으로 나아갈 때입니다.',
  },
  {
    title: '잔잔한 밤바다',
    icon: <Waves className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_20px_rgba(103,232,249,0.8)]" />,
    color: 'from-blue-950 via-blue-800 to-cyan-600',
    message: '고요한 물결처럼, 내면의 평화가 당신을 이끌어줄 것입니다. 흐름에 몸을 맡겨보세요.',
    glow: 'shadow-cyan-400/30',
    description: '밤바다 카드는 직관과 내면의 고요함을 상징합니다. 감정의 흐름에 귀 기울여 보세요.',
  },
  {
    title: '노을이 지는 풍요로운 땅',
    icon: <Sunset className="w-16 h-16 text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]" />,
    color: 'from-rose-600 via-orange-500 to-yellow-400',
    message: '황금빛 노을처럼, 당신의 노력이 아름다운 결실을 맺을 시간이 다가옵니다.',
    glow: 'shadow-orange-400/30',
    description: '노을 카드는 풍요와 완성을 상징합니다. 당신이 심은 씨앗이 열매를 맺는 시간입니다.',
  },
]

const hazeVariants = {
  initial: { opacity: 0, filter: 'blur(15px)', y: 20 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 1 } },
  exit: { opacity: 0, filter: 'blur(15px)', y: -10, transition: { duration: 0.6 } },
}

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [step, setStep] = useState(0)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [flipping, setFlipping] = useState(false)
  const [showZodiac, setShowZodiac] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const backgroundColor = useTransform(scrollYProgress, [0, 0.45, 1], ['#020617', '#f0f4f8', '#f0f4f8'])
  const textColor = useTransform(scrollYProgress, [0, 0.45, 1], ['#fef3c7', '#0f172a', '#0f172a'])
  const starOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0, 0])

  const current = steps[step]
  const isIntro = current?.type === 'intro'
  const isResult = step >= steps.length
  const progressPct = step === 0 ? 0 : Math.round((step / (steps.length - 1)) * 100)

  const handleNext = () => setStep(s => s + 1)

  const handleCardPick = () => {
    if (flipping) return
    const randomResult = results[Math.floor(Math.random() * results.length)]
    setSelectedResult(randomResult)
    setFlipping(true)
    setTimeout(() => {
      setStep(s => s + 1)
      setFlipping(false)
    }, 2500)
  }

  const handleRestart = () => {
    setStep(0)
    setSelectedResult(null)
    setShowZodiac(true)
    setSubmitted(false)
    setName('')
    setPhone('')
  }

  // ── 인트로: 스크롤 랜딩페이지 ──
  if (isIntro) {
    return (
      <motion.div ref={containerRef} style={{ backgroundColor }} className="relative">
        {showZodiac && <ZodiacFlash onComplete={() => setShowZodiac(false)} />}

        {/* Section 1: 밤하늘 인트로 */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
          {/* 별 + 글로우 — 스크롤하면 페이드 아웃 */}
          <motion.div style={{ opacity: starOpacity }} className="absolute inset-0 pointer-events-none overflow-hidden">
            <StarBackground />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-indigo-900/20 rounded-full blur-3xl rotate-12" />
            <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[150px] bg-purple-900/20 rounded-full blur-3xl -rotate-6" />
          </motion.div>

          {/* 제목 */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.9, delay: 1.5, ease: 'easeOut' }}
            className="z-20 text-center space-y-8 px-4"
          >
            <h1
              className="text-3xl md:text-5xl leading-relaxed whitespace-pre-wrap"
              style={{
                fontFamily: 'Georgia, serif',
                color: 'rgba(255,255,255,0.96)',
                textShadow:
                  '0 0 6px rgba(255,255,255,1), 0 0 18px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.45), 0 0 140px rgba(255,255,255,0.2)',
              }}
            >
              {current.title}
            </h1>
            <p
              className="text-base md:text-lg"
              style={{
                fontFamily: 'Georgia, serif',
                color: 'rgba(200,215,240,0.75)',
                textShadow: '0 0 8px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.35), 0 0 45px rgba(255,255,255,0.15)',
              }}
            >
              {current.subtitle}
            </p>
          </motion.div>

          {/* 스크롤 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-10 z-20 flex flex-col items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center"
            >
              <ArrowDown className="w-7 h-7" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2: 서사 + 프로젝트 홍보 */}
        <section className="relative min-h-screen w-full flex items-center justify-center py-32 px-6">
          <div className="max-w-4xl w-full">
            <motion.div style={{ color: textColor }} className="space-y-24">

              <FadeInSection>
                <h2 className="text-3xl md:text-5xl font-serif mb-8 border-l-4 border-amber-400 pl-6">
                  기억의 심연에서 길어 올린 별의 기록
                </h2>
                <p className="text-xl md:text-2xl leading-relaxed font-light opacity-90">
                  인류는 아주 오래전부터 밤하늘의 성좌를 읽으며 운명의 지도를 그려왔습니다.
                  그 복잡하고 신비로운 궤적 속에는 우리가 잊고 지냈던 수많은 해답이 숨겨져 있습니다.
                </p>
              </FadeInSection>

              <FadeInSection>
                <div className="bg-white/40 backdrop-blur-md border border-black/5 p-10 md:p-16 rounded-[2rem] shadow-2xl shadow-black/5">
                  <h3 className="text-4xl font-serif mb-8 text-black leading-snug">
                    고대의 지혜,<br />현대의 감각으로 다시 태어나다.
                  </h3>
                  {/* 직관 · 감각 · 상징 카드 */}
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                      { word: '직관', symbol: '◈', sub: 'Intuition' },
                      { word: '감각', symbol: '❋', sub: 'Sensation' },
                      { word: '상징', symbol: '⟡', sub: 'Symbol' },
                    ].map(({ word, symbol, sub }) => (
                      <div
                        key={word}
                        className="flex flex-col items-center justify-center gap-2 py-7 rounded-2xl border border-black/10"
                        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)' }}
                      >
                        <span className="text-2xl text-slate-400">{symbol}</span>
                        <span className="text-xl font-serif font-medium text-black">{word}</span>
                        <span className="text-xs tracking-widest text-slate-400 uppercase">{sub}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 text-lg text-slate-800 leading-relaxed">
                    <p>
                      저희는 모호하고 어려운 고전 점성술의 상징을 가장{' '}
                      <strong>직관적이고 감각적인 언어</strong>로 재해석하고 있습니다.
                    </p>
                    <p>
                      단순한 도구를 넘어, 누구나 자신의 내면을 선명하게 들여다볼 수 있도록 설계된 새로운 카드덱은
                      예술적 영감과 데이터 알고리즘을 결합하여 제작됩니다.
                    </p>
                    <p className="font-medium text-black pt-4">
                      당신의 손끝에서 완성되는 새로운 별의 문장을 곧 만나보십시오.
                    </p>
                  </div>
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={handleNext}
                      className="px-10 py-4 bg-black text-white rounded-full hover:bg-slate-800 transition-colors text-lg font-medium cursor-pointer"
                    >
                      {current.btn}
                    </button>
                  </div>
                </div>
              </FadeInSection>

            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-40 flex items-center justify-center" style={{ opacity: 0.3 }}>
          <motion.p style={{ color: textColor }} className="text-sm">
            © 2026 Celestial Epoch. All rights reserved.
          </motion.p>
        </footer>
      </motion.div>
    )
  }

  // ── 질문 / 결과 페이지 (기존 그대로) ──
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center overflow-x-hidden relative p-4 ${isResult ? 'justify-start pt-16' : 'justify-center'}`}
      style={{ background: '#020617' }}
    >
      <StarBackground />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-indigo-900/20 rounded-full blur-3xl rotate-12" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[150px] bg-purple-900/20 rounded-full blur-3xl -rotate-6" />
      </div>

      {/* 진행 바 */}
      {step > 0 && step < steps.length && (
        <div className="absolute top-6 w-full max-w-xl px-8 z-20">
          <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, rgba(245,158,11,1), rgba(253,224,71,1))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-right text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{progressPct}%</p>
        </div>
      )}

      <div className="relative z-20 w-full max-w-xl">
        <AnimatePresence mode="wait">
          {!isResult ? (
            <motion.div
              key={step}
              variants={hazeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {/* ── 카드 선택 ── */}
              {current.type === 'card-pick' ? (
                <div className="text-center space-y-12">
                  <h2
                    className="text-2xl leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.92)' }}
                  >
                    {current.q}
                  </h2>
                  <div className="flex justify-center gap-6">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -14, scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCardPick}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-32 h-52 rounded-2xl cursor-pointer relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                          border: '1.5px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 0 20px rgba(255,255,255,0.05)',
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full border flex items-center justify-center"
                            style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                            <div className="w-12 h-12 rounded-full border flex items-center justify-center"
                              style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                              <Sparkles className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>✦</div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>✦</div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {flipping && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm tracking-widest italic"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        ✦ 카드를 뒤집는 중... ✦
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

              /* ── 일반 질문 ── */
              ) : (
                <div
                  className="rounded-3xl p-8"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <h2
                    className="text-2xl mb-8 text-center leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.92)' }}
                  >
                    {current.q}
                  </h2>
                  <div className={`grid ${current.layout} gap-3`}>
                    {current.options?.map(opt => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNext}
                        className="p-3 text-sm rounded-xl transition-all duration-200 cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.8)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                          e.currentTarget.style.color = 'rgba(255,255,255,1)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                        }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

          /* ── 결과 화면 ── */
          ) : (
            <motion.div
              key="result"
              variants={hazeVariants}
              initial="initial"
              animate="animate"
              className="text-center w-full max-w-md mx-auto pb-12"
            >
              {/* 헤더 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm tracking-[0.3em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                ✦ Your Card ✦
              </motion.p>
              <h2
                className="text-xl mb-8"
                style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,255,255,0.85)' }}
              >
                당신의 내일을 비추는 풍경
              </h2>

              {/* 결과 카드 */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                className={`w-72 mx-auto rounded-3xl bg-gradient-to-br ${selectedResult?.color} flex flex-col items-center justify-center p-8 shadow-2xl ${selectedResult?.glow} relative overflow-hidden mb-4`}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1/2 rounded-t-3xl"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="mb-5"
                >
                  {selectedResult?.icon}
                </motion.div>
                <p className="text-xl font-serif text-white leading-relaxed break-keep text-center mb-4">
                  {selectedResult?.title}
                </p>
                <div className="w-16 h-px mb-4" style={{ background: 'rgba(255,255,255,0.3)' }} />
                <p className="text-xs text-white/80 leading-relaxed break-keep text-center">
                  {selectedResult?.description}
                </p>
              </motion.div>

              {/* 메시지 */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-sm leading-relaxed px-4 mb-10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {selectedResult?.message}
              </motion.p>

              {/* 문의 폼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="rounded-2xl p-6 mx-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 space-y-3"
                  >
                    <p className="text-2xl">✦</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      문의가 접수되었습니다.<br />곧 연락드리겠습니다.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-sm mb-5 tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      더 깊은 카드 해석을 원하신다면
                    </p>
                    <div className="space-y-3 mb-5">
                      <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.9)',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="전화번호"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.9)',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        }}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { if (name.trim() && phone.trim()) setSubmitted(true) }}
                      className="w-full py-3 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer"
                      style={{
                        background: (name.trim() && phone.trim()) ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: (name.trim() && phone.trim()) ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      보다 정확한 카드가 궁금해요
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* 재시작 */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                onClick={handleRestart}
                className="mt-8 text-sm underline underline-offset-4 transition-colors duration-200 cursor-pointer block mx-auto"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
              >
                돌아가기
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
