import type { SupabaseClient } from '@supabase/supabase-js'

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

/** Standard response shape for all service operations */
export interface ServiceResponse<T> {
  data: T | null
  error: string | null
}

/** The minimum shape a row must have to be addressable by id */
interface Identifiable {
  id: string | number
}

/** The CRUD interface returned by createService */
export interface Service<T extends Identifiable> {
  getAll: () => Promise<ServiceResponse<T[]>>
  getById: (id: T['id']) => Promise<ServiceResponse<T>>
  create: (data: Omit<T, 'id'>) => Promise<ServiceResponse<T>>
  update: (id: T['id'], data: Partial<Omit<T, 'id'>>) => Promise<ServiceResponse<T>>
  delete: (id: T['id']) => Promise<ServiceResponse<T>>
}

// ────────────────────────────────────────────────────────────────────
// Factory
// ────────────────────────────────────────────────────────────────────

/**
 * Creates a typed CRUD service for a Supabase table.
 *
 * The factory is deliberately decoupled from client creation — pass in
 * a SupabaseClient from either `utils/supabase/client.ts` (browser) or
 * `utils/supabase/server.ts` (server components / route handlers) so
 * the same service works in both environments.
 *
 * Usage:
 *   import { createClient } from '@/utils/supabase/client'
 *   import { createService } from '@/lib/services'
 *
 *   interface Profile { id: string; name: string; avatar_url: string }
 *   const profiles = createService<Profile>('profiles', createClient())
 *   const { data, error } = await profiles.getAll()
 */
export function createService<T extends Identifiable>(
  table: string,
  supabase: SupabaseClient
): Service<T> {
  return {
    async getAll(): Promise<ServiceResponse<T[]>> {
      const { data, error } = await supabase
        .from(table)
        .select('*')

      if (error) return { data: null, error: error.message }
      return { data: data as T[], error: null }
    },

    async getById(id: T['id']): Promise<ServiceResponse<T>> {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()

      if (error) return { data: null, error: error.message }
      return { data: data as T, error: null }
    },

    async create(payload: Omit<T, 'id'>): Promise<ServiceResponse<T>> {
      const { data, error } = await supabase
        .from(table)
        .insert(payload as Record<string, unknown>)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: data as T, error: null }
    },

    async update(
      id: T['id'],
      payload: Partial<Omit<T, 'id'>>
    ): Promise<ServiceResponse<T>> {
      const { data, error } = await supabase
        .from(table)
        .update(payload as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: data as T, error: null }
    },

    async delete(id: T['id']): Promise<ServiceResponse<T>> {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: data as T, error: null }
    }
  }
}
