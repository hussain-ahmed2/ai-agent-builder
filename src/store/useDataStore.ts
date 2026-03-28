import { create } from 'zustand'
import type { AgentData } from '@/types'

interface DataState {
  data: AgentData | null
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
  refetch: () => Promise<void>
}

export const useDataStore = create<DataState>()((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async () => {
    // Guard: skip if data already loaded — fixes the original re-fetch bug
    if (get().data) return
    return get().refetch()
  },

  refetch: async () => {
    set({ loading: true, error: null })
    try {
      // Simulated network delay preserved from original challenge scaffold
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const jsonData: AgentData = await response.json()
      set({ data: jsonData, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      console.error('[DataStore] fetch error:', err)
      set({ error: message, loading: false })
    }
  },
}))
