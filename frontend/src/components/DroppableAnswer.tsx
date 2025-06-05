import { useDroppable } from "@dnd-kit/core";
import { useTimerStore } from "@/stores/timerStore";

interface DroppableAnswerProps {
    id: number
    isEmpty: boolean
    shouldShake?: boolean
    children?: React.ReactNode
    className?: string
}
  
export function DroppableAnswer({ id, isEmpty, shouldShake, children, className }: DroppableAnswerProps) {
    const { timeLeft } = useTimerStore();
    const { isOver, setNodeRef } = useDroppable({ id })

    return (
      <div
        ref={setNodeRef}
        className={`rounded-lg flex items-center justify-center transition-all duration-200 ${className} ${
          timeLeft > 0 && isEmpty && isOver ? 'scale-110' : ''
        }`}
        style={{
          animation: shouldShake ? 'shake 0.6s ease-in-out' : undefined
        }}
      >
        {children}
        {shouldShake && (
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                20%, 40%, 60%, 80% { transform: translateX(8px); }
              }
            `
          }} />
        )}
      </div>
    )
}