'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ADMIN_PASSWORD = 'celestial2026'

interface Submission {
  id: string
  created_at: string
  name: string
  phone: string
  belief: string
  zodiac: string
  mbti: string
  life_area: string
  card_result: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [data, setData] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    supabase
      .from('survey_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data: rows }) => {
        setData((rows as Submission[]) ?? [])
        setLoading(false)
      })
  }, [authed])

  const handleLogin = () => {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
    setInput('')
    setData([])
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 w-full max-w-sm flex flex-col gap-5">
          <h1 className="text-white text-2xl font-bold text-center tracking-wide">관리자 로그인</h1>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-slate-400 placeholder:text-slate-500"
          />
          {error && <p className="text-red-400 text-sm text-center">비밀번호가 틀렸습니다.</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">설문 결과 관리</h1>
            <p className="text-slate-400 text-sm mt-1">총 {data.length}건</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-sm"
          >
            로그아웃
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400 text-center py-20">불러오는 중...</div>
        ) : data.length === 0 ? (
          <div className="text-slate-500 text-center py-20">저장된 설문 결과가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-300">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">제출일시</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">이름</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">연락처</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">영적인 힘</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">별자리</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">MBTI</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">관심 영역</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">선택 카드</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-t border-slate-700 text-slate-200 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'} hover:bg-slate-800 transition-colors`}
                  >
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.phone}</td>
                    <td className="px-4 py-3">{row.belief}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.zodiac}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.mbti}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.life_area}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.card_result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
