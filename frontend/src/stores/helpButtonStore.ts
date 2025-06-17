import { create } from 'zustand'

interface HelpButtonState {
  helpCount: number
  disabled: boolean
  enableHelp: (count: number, helpFunction: () => Promise<void>) => void
  helpClicked: () => void
}

export const useHelpButtonStore = create<HelpButtonState>((set, get) => ({
  helpCount: 0,
  disabled: true,
  helpClicked: () => {},

  enableHelp: (count: number, helpFunction: () => Promise<void>) => {
    set({ 
      helpCount: count, 
      helpClicked: async () => {
        const state = get()
        set({ disabled: true, helpCount: state.helpCount - 1 })
        await helpFunction()
        set({ disabled: state.helpCount === 1 })
      },
      disabled: count === 0 
    })
  },


})) 