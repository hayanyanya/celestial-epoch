import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  'https://bgvixbecqtorckwhuzrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndml4YmVjcXRvcmNrd2h1enJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQyNTEyOSwiZXhwIjoyMDkzMDAxMTI5fQ.5e520djk5WfJDh6nPrMOHT-AHzI6CHofryF6V_Uf69s'
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { error } = await supabase.from('survey_submissions').insert({
    belief: body.belief ?? null,
    zodiac: body.zodiac ?? null,
    mbti: body.mbti ?? null,
    life_area: body.life_area ?? null,
    card_result: body.card_result ?? null,
    name: body.name ?? null,
    phone: body.phone ?? null,
  })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
