import { create } from 'zustand'

interface BuilderState {
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
  agentName: string

  setProfile: (id: string) => void
  addSkill: (id: string) => void
  removeSkill: (id: string) => void
  reorderSkills: (ids: string[]) => void
  addLayer: (id: string) => void
  removeLayer: (id: string) => void
  reorderLayers: (ids: string[]) => void
  setProvider: (provider: string) => void
  setAgentName: (name: string) => void
  reset: () => void
}

const initialState = {
  selectedProfile: '',
  selectedSkills: [],
  selectedLayers: [],
  selectedProvider: '',
  agentName: '',
}

export const useBuilderStore = create<BuilderState>()((set, get) => ({
  ...initialState,

  setProfile: (id) => set({ selectedProfile: id }),

  addSkill: (id) => {
    if (!get().selectedSkills.includes(id)) {
      set((state) => ({ selectedSkills: [...state.selectedSkills, id] }))
    }
  },

  removeSkill: (id) =>
    set((state) => ({
      selectedSkills: state.selectedSkills.filter((s) => s !== id),
    })),

  // Used by dnd-kit after a drag-and-drop reorder
  reorderSkills: (ids) => set({ selectedSkills: ids }),

  addLayer: (id) => {
    if (!get().selectedLayers.includes(id)) {
      set((state) => ({ selectedLayers: [...state.selectedLayers, id] }))
    }
  },

  removeLayer: (id) =>
    set((state) => ({
      selectedLayers: state.selectedLayers.filter((l) => l !== id),
    })),

  // Used by dnd-kit after a drag-and-drop reorder
  reorderLayers: (ids) => set({ selectedLayers: ids }),

  setProvider: (provider) => set({ selectedProvider: provider }),

  setAgentName: (name) => set({ agentName: name }),

  reset: () => set(initialState),
}))
