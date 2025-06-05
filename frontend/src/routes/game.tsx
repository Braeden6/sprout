import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { GameLayout } from '../components/GameLayout';
import { useHelpButtonStore } from '@/stores/helpButtonStore';
import { useTimerStore } from '@/stores/timerStore';

export const Route = createFileRoute('/game')({
  component: Game,
})

interface Shape {
  id: string
  src: string
  x: number
  y: number
  isPlaced: boolean
  placedInSquare?: string
}

interface DroppableSquareProps {
  id: string
  children?: React.ReactNode
}

function DroppableSquare({ id, children }: DroppableSquareProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg flex items-center justify-center transition-colors ${
        isOver ? 'bg-green-100 border-2 border-green-400' : ''
      }`}
    >
      {children}
    </div>
  )
}

interface DraggableShapeProps {
  shape: Shape
}

// tech debt: remove this game wont be used anymore
function DraggableShape({ shape }: DraggableShapeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: shape.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  if (shape.isPlaced) {
    return (
      <img
        src={shape.src}
        alt="Shape"
        className="w-[100px] h-[100px] object-contain"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: shape.x,
        top: shape.y,
        zIndex: isDragging ? 1000 : 10,
        ...style,
      }}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <img
        src={shape.src}
        alt="Shape"
        className="w-[100px] h-[100px] object-contain pointer-events-none"
      />
    </div>
  )
}

const GRID_SIZE = 2;

function Game() {
    const { enableHelp } = useHelpButtonStore();
    const { startTimer } = useTimerStore();
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [grid, setGrid] = useState<(Shape|null)[]>(Array(GRID_SIZE * GRID_SIZE).fill(null));
    const [activeId, setActiveId] = useState<string | null>(null);

    const shapeImages = [
        '/shapes/red_oval.png',
        '/shapes/purple_rectangle.png',
        '/shapes/blue_circle.png',
        '/shapes/blue_oval.png',
        '/shapes/orange_star.png',
        '/shapes/red_circle.png',
        '/shapes/red_triangle.png'
    ]

    useEffect(() => {
        const initialShapes: Shape[] = shapeImages.map((src, index) => ({
            id: `shape-${index}`,
            src,
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100),
            isPlaced: false,
        }))
        setShapes(initialShapes)
        enableHelp(3, () => {
            console.log("Help button clicked");
        });
        startTimer(5 * 60);
    }, [])

    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const getHelp = () => {
        console.log('clicked')
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        console.log(active, over)
        setActiveId(null)

        if (over) {
            console.log(over)
        } else {
            const shape = shapes.find(shape => shape.id === active.id)
            if (shape) {
                console.log(event)
                setShapes([...shapes.filter(s => s.id !== active.id), shape])
            }
        }
    }

    function handleDragOver(event: DragOverEvent) {
        console.log(event)
    }

    const activeShape = shapes.find(shape => shape.id === activeId)
    const unplacedShapes = shapes.filter(shape => !shape.isPlaced)

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <div className="min-h-screen flex items-center justify-center p-4">

                <GameLayout showTimer>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-${GRID_SIZE} gap-4 w-[25vw] h-[40vh] p-8`}>
                        {
                            grid.map((shape, index) => (
                                <DroppableSquare key={index} id={`square-${index}`}>
                                    {shape && (
                                        <DraggableShape shape={shape} />
                                    )}
                                </DroppableSquare>
                            ))
                        }
                    </div>

                    {/* Render unplaced draggable shapes */}
                    {unplacedShapes.map((shape) => (
                        <DraggableShape key={shape.id} shape={shape} />
                    ))}
                </GameLayout>

                <DragOverlay>
                    {activeShape && (
                        <img
                            src={activeShape.src}
                            alt="Shape"
                            className="w-[100px] h-[100px] object-contain opacity-75"
                        />
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    )
}



