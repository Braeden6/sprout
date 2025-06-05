import { create } from 'zustand'

interface HelpButtonState {
  helpCount: number
  helpFunction: () => void
  enableHelp: (count: number, helpFunction: () => void) => void
  disableHelp: () => void
}

export const useHelpButtonStore = create<HelpButtonState>((set) => ({
  helpCount: 0,
  helpFunction: () => {},

  enableHelp: (count: number, helpFunction: () => void) => {
    set({ helpCount: count, helpFunction: helpFunction })
  },

  disableHelp: () => {
    set({ helpCount: 0, helpFunction: () => {} })
  }
  

})) 