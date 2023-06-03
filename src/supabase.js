import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseURL = 'https://gojxesiabkpnvfarjkhh.supabase.co'

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvanhlc2lhYmtwbnZmYXJqa2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIxNTY5ODMsImV4cCI6MTk5NzczMjk4M30.dv_-9qLBxttFZ1vojNluoz_4wRSiRmrqFb6gFX6QfZI'

export default createClient(supabaseURL, supabaseKey)