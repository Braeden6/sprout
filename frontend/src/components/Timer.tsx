import { useTimerStore } from '@/stores/timerStore'

interface TimerProps {
    className?: string
  }
  
  export function Timer({ className = "" }: TimerProps) {
    const timeLeft = useTimerStore(state => state.timeLeft)
    
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  
    return (
      <div className={`text-8xl border-5 border-red-500 bg-white rounded-md p-2 ${className}`}>
        {formatTime(timeLeft)}
      </div>
    )
  }