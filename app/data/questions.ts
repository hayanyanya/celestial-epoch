export interface Option {
  text: string
  value: string
  effect?: string
}

export interface Question {
  id: number
  type: 'intro' | 'choice'
  question: string
  description?: string
  buttonText?: string
  options?: Option[]
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'intro',
    question: '새로운 별의 지도를 그려볼까요?',
    description: '점성술과 타로가 만나는 신비로운 여정을 시작합니다.',
    buttonText: '설문 시작',
  },
  {
    id: 2,
    type: 'choice',
    question: '당신의 영혼이 가장 끌리는 원소는 무엇인가요?',
    options: [
      { text: '타오르는 불', value: 'fire', effect: 'haze-warm' },
      { text: '흐르는 물', value: 'water', effect: 'haze-cool' },
      { text: '자유로운 바람', value: 'air', effect: 'haze-light' },
      { text: '단단한 흙', value: 'earth', effect: 'haze-deep' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    question: '카드 뒷면에 어떤 별의 무늬를 새기고 싶나요?',
    options: [
      { text: '정교한 별자리 차트', value: 'chart' },
      { text: '미니멀한 달의 위상', value: 'moon' },
    ],
  },
]
