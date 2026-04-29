import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://bgvixbecqtorckwhuzrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndml4YmVjcXRvcmNrd2h1enJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjUxMjksImV4cCI6MjA5MzAwMTEyOX0.bhJ6yKGBXeme-UTt1cUegVbfFSBFV3Cz24QtccdnyaE'
)
