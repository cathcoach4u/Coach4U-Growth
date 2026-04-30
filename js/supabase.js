// Supabase configuration
const SUPABASE_URL = 'https://uoixetfvboevjxlkfyqy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaXhldGZ2Ym9ldmp4bGtmeXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDY2ODAsImV4cCI6MjA5MDQyMjY4MH0.ZXYJVdvcj70aGMH1FAixIr0hNCaCDSYLEL93hHVCGDU'

// Initialize Supabase client (window.supabase is provided by the CDN script)
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
