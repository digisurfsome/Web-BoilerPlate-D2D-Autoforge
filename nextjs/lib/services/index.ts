// ────────────────────────────────────────────────────────────────────
// Service Layer — Typed Supabase CRUD Factory
// ────────────────────────────────────────────────────────────────────
//
// How to create a service for a new table:
//
// 1. Define the row type (or generate it from types_db.ts):
//
//    interface Todo {
//      id: string
//      user_id: string
//      title: string
//      completed: boolean
//      created_at: string
//    }
//
// 2. Create the service by passing the table name and a Supabase client:
//
//    import { createClient } from '@/utils/supabase/client'   // browser
//    // OR
//    import { createClient } from '@/utils/supabase/server'   // server
//
//    import { createService } from '@/lib/services'
//
//    const todos = createService<Todo>('todos', createClient())
//
// 3. Use the service:
//
//    const { data: allTodos, error } = await todos.getAll()
//    const { data: todo }            = await todos.getById('abc-123')
//    const { data: newTodo }         = await todos.create({ user_id: '...', title: 'Ship it', completed: false })
//    const { data: updated }         = await todos.update('abc-123', { completed: true })
//    const { data: deleted }         = await todos.delete('abc-123')
//
// Every method returns { data: T | T[] | null, error: string | null }
// so error handling is consistent across the app.
// ────────────────────────────────────────────────────────────────────

export { createService } from './base-service'
export type { Service, ServiceResponse } from './base-service'
