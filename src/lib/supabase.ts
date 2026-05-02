import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          bio: string | null
          avatar_url: string | null
          role: 'talent' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'talent' | 'client'
        }
        Update: {
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'talent' | 'client'
        }
      }
      synthetic_talents: {
        Row: {
          id: string
          owner_id: string
          persona_data: Record<string, any>
          daily_rate: number
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          owner_id: string
          persona_data?: Record<string, any>
          daily_rate?: number
          status?: 'active' | 'inactive' | 'pending'
        }
        Update: {
          persona_data?: Record<string, any>
          daily_rate?: number
          status?: 'active' | 'inactive' | 'pending'
        }
      }
      jobs: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          budget: number
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          client_id: string
          title: string
          description: string
          budget?: number
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
        }
        Update: {
          title?: string
          description?: string
          budget?: number
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
        }
      }
      hires: {
        Row: {
          id: string
          job_id: string
          talent_id: string
          started_at: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          job_id: string
          talent_id: string
          status?: 'active' | 'completed' | 'cancelled'
        }
        Update: {
          status?: 'active' | 'completed' | 'cancelled'
        }
      }
    }
  }
}
