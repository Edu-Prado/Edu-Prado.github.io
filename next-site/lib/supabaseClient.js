import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gvnxngmxlxppvqtoqler.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bnhuZ214bHhwcHZxdG9xbGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDE1OTgsImV4cCI6MjA1NzgxNzU5OH0.YqckHPGQ-5DAfFDITZ-vDtghXah0qwwPaIzYfVRFu5U'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
