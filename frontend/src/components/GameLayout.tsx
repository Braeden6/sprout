import { HelpButton } from './HelpButton'
import { Timer } from './Timer'

interface GameLayoutProps {
    children: React.ReactNode
    showTimer?: boolean
  }
  
export function GameLayout({ children, showTimer = false }: GameLayoutProps) {
  return (
      <>
        <HelpButton className="absolute top-[6vh] left-[6vw] z-10" />
        <img src="/game_bg.jpg" alt="Game" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 z-10 w-[70vw] h-[70vh]">
          <img src="/test.svg" alt="Game" className="w-full h-full" />
          {showTimer && <Timer className="absolute -top-[5vh] left-1/2 -translate-x-1/2" />}
          {children}
        </div>
      </>
  )
}

