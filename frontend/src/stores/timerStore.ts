import { create } from 'zustand'

interface TimerState {
  timeLeft: number
  isRunning: boolean
  startTimer: (initialTime: number) => void
  stopTimer: () => void
  resetTimer: (time: number) => void
  tick: () => void
}

let timerInterval: NodeJS.Timeout | null = null

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: 0,
  isRunning: false,
  
  startTimer: (initialTime: number) => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    
    set({ timeLeft: initialTime, isRunning: true })
    
    timerInterval = setInterval(() => {
      const { timeLeft, isRunning } = get()
      
      if (!isRunning || timeLeft <= 0) {
        if (timerInterval) {
          clearInterval(timerInterval)
          timerInterval = null
        }
        set({ isRunning: false })
        return
      }
      
      set({ timeLeft: timeLeft - 1 })
    }, 1000)
  },
  
  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    set({ isRunning: false })
  },
  
  resetTimer: (time: number) => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    set({ timeLeft: time, isRunning: false })
  },
  
  tick: () => {
    const { timeLeft } = get()
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 })
    } else {
      set({ isRunning: false })
    }
  }
})) 