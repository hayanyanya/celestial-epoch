'use client'

import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Sparkles, Sun, Sunset, Waves, ArrowDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import StarBackground from './components/StarBackground'

const ZodiacFlash = dynamic(() => import('./components/ZodiacFlash'), { ssr: false })

interface SurveyStep {
  id: string | number
  type?: 'intro' | 'card-pick' | 'landing'
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
    id: 'landing',
    type: 'landing',
  },
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
  const [submitError, setSubmitError] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [fadeInVisible, setFadeInVisible] = useState<boolean[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const backgroundColor = useTransform(scrollYProgress, [0, 0.45, 1], ['#020617', '#f0f4f8', '#f0f4f8'])
  const textColor = useTransform(scrollYProgress, [0, 0.45, 1], ['#fef3c7', '#0f172a', '#0f172a'])
  const starOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0, 0])

  const current = steps[step]
  const isLanding = current?.type === 'landing'
  const isIntro = current?.type === 'intro'
  const isResult = step >= steps.length
  const progressPct = step === 0 ? 0 : Math.round((step / (steps.length - 1)) * 100)

  const handleNext = (answer?: string) => {
    if (answer !== undefined) setAnswers(prev => ({ ...prev, [step]: answer }))
    setStep(s => s + 1)
  }

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

  const handleSubmitForm = async () => {
    if (!name.trim() || !phone.trim()) return
    setSubmitError(false)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          belief: answers[1],
          zodiac: answers[2],
          mbti: answers[3],
          life_area: answers[4],
          card_result: selectedResult?.title ?? null,
          name: name.trim(),
          phone: phone.trim(),
        }),
      })
      const json = await res.json()
      if (!json.ok) { setSubmitError(true); return }
      setSubmitted(true)
    } catch {
      setSubmitError(true)
    }
  }

  const handleRestart = () => {
    setStep(0)
    setSelectedResult(null)
    setShowZodiac(true)
    setSubmitted(false)
    setName('')
    setPhone('')
    setAnswers({})
  }

  // Landing Page
  if (isLanding) {
    return (
      <div className="min-h-screen bg-[#2b1d12] text-[#e8e4d9] overflow-hidden" style={{ fontFamily: "'Special Elite', system-ui, serif" }}>
        {/* Hero */}
        <section className="h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <svg className="absolute w-96 h-96 -top-20 -left-20 fill-[#b5a642] opacity-10 animate-spin" style={{ animationDuration: '20s' }} viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.66.07 1l-2.11 1.63c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63z"/></svg>

          <div className="z-10 text-center space-y-8">
            <div>
              <p className="text-[#b87333] tracking-[0.4em] text-sm mb-4 uppercase">Industrial Divination</p>
              <h1 style={{ fontFamily: "'Nanum Myeongjo'" }} className="text-5xl md:text-8xl font-bold text-[#b5a642] drop-shadow-lg">
                황동의 <span className="text-[#b87333] italic">신탁</span>
              </h1>
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-[#b87333] to-transparent mx-auto my-10"></div>
              <p className="max-w-md mx-auto text-lg leading-relaxed opacity-80 italic">
                "증기와 태엽이 맞물려 돌아가는 소리, <br /> 기계 장치 속에 감춰진 당신의 운명을 해독합니다."
              </p>
            </div>
            <div className="pt-10 flex flex-col items-center gap-4">
              <div className="w-1 h-16 bg-gradient-to-b from-[#b5a642] to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Mechanism */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="flex justify-center">
              <div className="border-8 border-[#b87333] w-72 h-[450px] bg-[#1a120b] p-1 shadow-2xl relative">
                <div className="absolute w-[10px] h-[10px] bg-[#b5a642] rounded-full top-2 left-2 shadow-inner"></div>
                <div className="absolute w-[10px] h-[10px] bg-[#b5a642] rounded-full top-2 right-2 shadow-inner"></div>
                <div className="absolute w-[10px] h-[10px] bg-[#b5a642] rounded-full bottom-2 left-2 shadow-inner"></div>
                <div className="absolute w-[10px] h-[10px] bg-[#b5a642] rounded-full bottom-2 right-2 shadow-inner"></div>

                <div className="w-full h-full border border-[#b5a642]/20 flex flex-col items-center justify-center space-y-6">
                  <svg className="w-24 h-24 fill-[#b87333] opacity-40 animate-spin" style={{ animationDuration: '10s' }} viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                  <p className="text-[#b5a642] text-xs tracking-widest uppercase">Steam-Powered Tarot</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h2 style={{ fontFamily: "'Nanum Myeongjo'" }} className="text-3xl md:text-5xl font-bold text-[#b5a642]">
                정교한 <br /><span className="text-[#b87333]">기계식 영감</span>
              </h2>
              <p className="text-lg leading-loose text-stone-400 break-keep">
                우리는 모호한 마법 대신, <strong>논리적이고 정교한 기계 장치</strong>로 타로를 해석합니다.
                3D 펜으로 직접 부품을 빚어내듯, 당신의 미래를 구성하는 톱니바퀴들을 하나씩 조립해 보세요.
                거친 금속의 질감 속에 숨겨진 가장 따뜻한 지혜를 발견하게 될 것입니다.
              </p>
              <div className="pt-6">
                <button onClick={() => handleNext()} className="px-12 py-4 bg-[#b87333] text-[#2b1d12] font-bold uppercase tracking-widest hover:bg-[#b5a642] transition-colors shadow-lg">
                  장치 가동하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Spec */}
        <section className="py-40 border-t border-[#b5a642]/10 bg-black/20">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-[#b5a642] text-3xl">⚙</div>
              <h4 className="font-bold text-[#b87333]">PRECISION</h4>
              <p className="text-xs text-stone-500 uppercase leading-relaxed">0.01mm 오차 없는 <br />운명의 설계</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#b5a642] text-3xl">⚒</div>
              <h4 className="font-bold text-[#b87333]">HANDCRAFT</h4>
              <p className="text-xs text-stone-500 uppercase leading-relaxed">손끝에서 완성되는 <br />아날로그적 진실</p>
            </div>
            <div className="space-y-4">
              <div className="text-[#b5a642] text-3xl">♨</div>
              <h4 className="font-bold text-[#b87333]">PRESSURE</h4>
              <p className="text-xs text-stone-500 uppercase leading-relaxed">강력한 직관의 <br />증기 에너지</p>
            </div>
          </div>
        </section>

        <footer className="py-20 text-center opacity-30 text-[10px] tracking-[0.8em]">
          © 2026 THE STEAMPUNK ORACLE WORKS.
        </footer>
      </div>
    )
  }

  // Intro Page
  if (isIntro) {
    return (
      <motion.div ref={containerRef} style={{ backgroundColor }} className="relative">
        {showZodiac && <ZodiacFlash onComplete={() => setShowZodiac(false)} />}

        {/* Section 1 */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
          <motion.div style={{ opacity: starOpacity }} className="absolute inset-0 pointer-events-none overflow-hidden">
            <StarBackground />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-indigo-900/20 rounded-full blur-3xl rotate-12" />
            <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[150px] bg-purple-900/20 rounded-full blur-3xl -rotate-6" />
          </motion.div>

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
                textShadow: '0 0 6px rgba(255,255,255,1), 0 0 18px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.45), 0 0 140px rgba(255,255,255,0.2)',
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

          {/* Scroll Indicator */}
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
              <ArrowDown className="w-7 h-7 strokeWidth-[2.5]" />
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2 */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-transparent to-slate-100">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center space-y-16">
              <div className="space-y-6">
                <p className="text-slate-600 text-sm tracking-widest uppercase">당신의 여정</p>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                  기억의 심연에서<br />길어 올린 별의 기록
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-6 py-12">
                <div className="rounded-2xl border border-slate-300 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-5xl mb-4">💫</p>
                  <p className="text-sm font-semibold text-slate-700">직관</p>
                </div>
                <div className="rounded-2xl border border-slate-300 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-5xl mb-4">🎨</p>
                  <p className="text-sm font-semibold text-slate-700">감각</p>
                </div>
                <div className="rounded-2xl border border-slate-300 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-5xl mb-4">📖</p>
                  <p className="text-sm font-semibold text-slate-700">상징</p>
                </div>
              </div>

              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNext()}
                  className="px-12 py-4 bg-black text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  설문 시작하기
                </motion.button>
              </div>
            </div>
          </FadeInSection>
        </section>

        <footer className="py-12 text-center text-slate-500 text-xs tracking-widest">
          © 2026 Celestial Epoch. All rights reserved.
        </footer>
      </motion.div>
    )
  }

  // Survey Pages
  if (!isResult) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden relative p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-700 z-50">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>

        <AnimatePresence mode="wait">
          {current?.q && (
            <motion.div
              key={step}
              variants={hazeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl w-full space-y-12"
            >
              {/* Question */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {current.q}
                </h2>
              </div>

              {/* Options */}
              <div className={`grid ${current.layout} gap-4 w-full`}>
                {current.options?.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNext(opt)}
                    className="px-6 py-4 rounded-2xl text-center font-semibold transition-all duration-300 border-2 border-slate-600 text-white hover:border-indigo-400 hover:bg-indigo-500/10"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {current?.type === 'card-pick' && (
            <motion.div
              key={step}
              variants={hazeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl w-full space-y-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">{current.q}</h2>

              {!selectedResult ? (
                <div className="grid grid-cols-3 gap-6">
                  {results.map((result, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCardPick}
                      className="h-64 rounded-2xl border-4 border-indigo-500 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center space-y-4 hover:border-indigo-300 transition-colors p-4"
                    >
                      {result.icon}
                      <p className="text-sm font-semibold text-slate-300">{result.title}</p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center">{selectedResult.icon}</div>
                  <h3 className="text-3xl font-bold text-indigo-300">{selectedResult.title}</h3>
                  <p className="text-lg text-slate-300 leading-relaxed">{selectedResult.message}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Result Page
  if (isResult) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden relative p-4 pt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full space-y-12"
        >
          {!submitted ? (
            <>
              {/* Result Display */}
              <div className="text-center space-y-8">
                <div className="flex justify-center">{selectedResult?.icon}</div>
                <h2 className="text-4xl md:text-5xl font-bold text-white">{selectedResult?.title}</h2>
                <p className="text-xl text-slate-300 leading-relaxed">{selectedResult?.message}</p>
                <div className="pt-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <p className="text-base text-slate-200">{selectedResult?.description}</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-6 pt-8">
                <p className="text-center text-slate-300 font-semibold">더 깊은 해석을 원하신다면</p>
                <div className="space-y-4">
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
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitForm}
                  className="w-full py-3 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer"
                  style={{
                    background: (name.trim() && phone.trim()) ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: (name.trim() && phone.trim()) ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  보다 정확한 카드가 궁금해요
                </motion.button>
                {submitError && (
                  <p className="text-red-400 text-xs text-center mt-2">저장 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                )}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8 py-20"
            >
              <p className="text-3xl font-bold text-indigo-300">문의가 접수되었습니다</p>
              <p className="text-slate-300">곧 연락드리겠습니다.</p>
            </motion.div>
          )}

          {/* Restart Button */}
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
      </div>
    )
  }

  return null
}
