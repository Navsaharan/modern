export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          meta_description: string | null
          created_at: string
          updated_at: string
          published: boolean
          order_index: number
        }
        Insert: {
          id?: string
          title: string
          slug: string
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          published?: boolean
          order_index?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          meta_description?: string | null
          created_at?: string
          updated_at?: string
          published?: boolean
          order_index?: number
        }
      }
      sections: {
        Row: {
          id: string
          page_id: string
          type: string
          title: string | null
          content: Json
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          type: string
          title?: string | null
          content?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          type?: string
          title?: string | null
          content?: Json
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      design_settings: {
        Row: {
          id: string
          name: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: Json
          updated_at?: string
        }
      }
      form_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          read?: boolean
        }
      }
      analytics: {
        Row: {
          id: string
          page_slug: string
          view_count: number
          last_viewed_at: string
        }
        Insert: {
          id?: string
          page_slug: string
          view_count?: number
          last_viewed_at?: string
        }
        Update: {
          id?: string
          page_slug?: string
          view_count?: number
          last_viewed_at?: string
        }
      }
    }
  }
}

