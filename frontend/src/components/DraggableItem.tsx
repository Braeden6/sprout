import { useDraggable } from "@dnd-kit/core"

interface DraggableItemProps {
    children: React.ReactNode
    id: string
    className: string
  }
  
  
export function DraggableItem({ children, id, className }: DraggableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      isDragging,
    } = useDraggable({
      id: id,
    })
    
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''} ${className}`}
      >
        {children}
      </div>
    )
  }