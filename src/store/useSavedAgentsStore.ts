import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SavedAgent } from '@/types'
import { useBuilderStore } from './useBuilderStore'

interface SavedAgentsState {
  savedAgents: SavedAgent[]
  save: () => void
  load: (agent: SavedAgent) => void
  delete: (id: string) => void
  clearAll: () => void
}

export const useSavedAgentsStore = create<SavedAgentsState>()(
  persist(
    (set, get) => ({
      savedAgents: [],

      save: () => {
        const builder = useBuilderStore.getState()
        if (!builder.agentName.trim()) return

        const newAgent: SavedAgent = {
          id: crypto.randomUUID(),
          name: builder.agentName,
          profileId: builder.selectedProfile,
          skillIds: [...builder.selectedSkills],
          layerIds: [...builder.selectedLayers],
          provider: builder.selectedProvider,
          createdAt: Date.now(),
        }

        set({ savedAgents: [...get().savedAgents, newAgent] })
        // Clear the agent name field after a successful save
        builder.setAgentName('')
      },

      load: (agent) => {
        useBuilderStore.getState().reset()
        useBuilderStore.setState({
          selectedProfile: agent.profileId ?? '',
          selectedSkills: [...(agent.skillIds ?? [])],
          selectedLayers: [...(agent.layerIds ?? [])],
          selectedProvider: agent.provider ?? '',
          agentName: agent.name,
        })
      },

      delete: (id) =>
        set((state) => ({
          savedAgents: state.savedAgents.filter((a) => a.id !== id),
        })),

      clearAll: () => set({ savedAgents: [] }),
    }),
    {
      name: 'agent-builder-saved', // localStorage key
    }
  )
)
