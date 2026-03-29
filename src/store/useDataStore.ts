import { create } from 'zustand'
import type { AgentData } from '@/types'

/**
 * DataStore manages the read-only catalog of available skills, profiles, and layers.
 * 
 * DESIGN RATIONALE:
 * We decouple the constant library data (this store) from the user's current 
 * configuration (BuilderStore) to prevent heavy data objects from being 
 * tracked/re-rendered during every keystroke of the 'Agent Name' field.
 */
interface DataState {
  data: AgentData | null
  loading: boolean
  error: string | null
  fetching: boolean // INTERNAL GUARD: Prevents multiple concurrent fetch attempts on mount
  fetchData: () => Promise<void>
  refetch: () => Promise<void>
}

export const useDataStore = create<DataState>()((set, get) => ({
  data: null,
  loading: false,
  error: null,
  fetching: false,

  /**
   * Safe initialization method meant for useEffect(..., [])
   * BUG FIX: Addresses the 'Re-fetching' anti-pattern where data was re-loaded on every render.
   */
  fetchData: async () => {
    // Guard: Return immediately if data is already in memory or if a request is already in flight.
    if (get().data || get().fetching) return
    return get().refetch()
  },

  /**
   * Forces a fresh fetch from the server.
   */
  refetch: async () => {
    // Prevent overlapping requests if already loading
    if (get().loading) return
    
    set({ loading: true, error: null, fetching: true })
    try {
      // PERFORMANCE SIMULATION: Preserved the artificial delay from the original scaffold
      // to test loading state UI transitions.
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const jsonData: AgentData = await response.json()
      
      // Update store and clear the internal fetching lock
      set({ data: jsonData, loading: false, fetching: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      console.error('[DataStore] fetch error:', err)
      set({ error: message, loading: false, fetching: false })
    }
  },
}))
