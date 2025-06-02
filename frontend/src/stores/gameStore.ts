import { create } from 'zustand'

interface Shape {
  id: string
  type: 'triangle' | 'rectangle' | 'circle' | 'oval' | 'star'
  color: 'red' | 'blue' | 'purple' | 'orange' | 'green'
  size: 'small' | 'medium' | 'large'
}

interface GameState {
  timeLeft: number
  gridCells: (Shape | null)[]
  availableShapes: Shape[]
  selectedShape: Shape | null
  score: number
  isGameActive: boolean
  targetPattern: Shape[]
  
  // Actions
  setSelectedShape: (shape: Shape | null) => void
  placeShapeInGrid: (cellIndex: number) => void
  startGame: () => void
  pauseGame: () => void
  resetGame: () => void
  decrementTime: () => void
  generateNewPattern: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  timeLeft: 299, // 4:59
  gridCells: [null, null, null, null],
  availableShapes: [],
  selectedShape: null,
  score: 0,
  isGameActive: false,
  targetPattern: [],

  setSelectedShape: (shape) => set({ selectedShape: shape }),

  placeShapeInGrid: (cellIndex) => {
    const { selectedShape, gridCells } = get()
    if (selectedShape && gridCells[cellIndex] === null) {
      const newGridCells = [...gridCells]
      newGridCells[cellIndex] = selectedShape
      set({ 
        gridCells: newGridCells,
        selectedShape: null
      })
    }
  },

  startGame: () => {
    set({ isGameActive: true })
    get().generateNewPattern()
  },

  pauseGame: () => set({ isGameActive: false }),

  resetGame: () => set({
    timeLeft: 299,
    gridCells: [null, null, null, null],
    selectedShape: null,
    score: 0,
    isGameActive: false
  }),

  decrementTime: () => {
    const { timeLeft } = get()
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 })
    } else {
      set({ isGameActive: false })
    }
  },

  generateNewPattern: () => {
    const shapes: Shape[] = [
      { id: '1', type: 'triangle', color: 'red', size: 'medium' },
      { id: '2', type: 'rectangle', color: 'purple', size: 'medium' },
      { id: '3', type: 'circle', color: 'red', size: 'medium' },
      { id: '4', type: 'circle', color: 'blue', size: 'large' },
      { id: '5', type: 'oval', color: 'blue', size: 'large' },
      { id: '6', type: 'star', color: 'orange', size: 'medium' },
      { id: '7', type: 'triangle', color: 'orange', size: 'small' },
    ]
    
    set({ 
      availableShapes: shapes,
      targetPattern: [shapes[6]] // Orange triangle as shown in the grid
    })
  }
})) 