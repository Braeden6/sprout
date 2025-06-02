import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';


export const Route = createFileRoute('/games/face')({
    component: Face,
  })


  interface DraggableItemProps {
    children: React.ReactNode
    id: string
    className: string
  }
  
  
  function DraggableItem({ children, id, className }: DraggableItemProps) {
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

  interface DroppableAnswerProps {
    id: number
    children?: React.ReactNode
  }
  
  function DroppableAnswer({ id, children }: DroppableAnswerProps) {
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


function Face() {
    const [faceImages, setFaceImage] = useState<HTMLImageElement[]>([]);
    const [emotionOptions, setEmotionOptions] = useState<(string|null)[]>([
        'happy',
        'sad',
        'angry',
        'surprised'
    ]);
    const [draggedEmotion, setDraggedEmotion] = useState<string|null>(null);
    const [emotionPlaced, setEmotionPlaced] = useState<(string|null)[]>([
        null,
        null,
        null,
        null
    ]);


    useEffect(() => {
        const imageUrls = [
            '/shapes/blue_circle.png',
            '/shapes/blue_oval.png', 
            '/shapes/orange_star.png',
            '/shapes/purple_rectangle.png'
        ];

        const loadImages = async () => {
            const imagePromises = imageUrls.map(url => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = url;
                });
            });

            try {
                const loadedImages = await Promise.all(imagePromises);
                setFaceImage(loadedImages);
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        };

        loadImages();
    }, [])

    function handleDragStart(event: DragStartEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setDraggedEmotion(null);
        const { active, over } = event;

        if (over) {
            setEmotionPlaced(prev => {
                const newPlaced = [...prev];
                newPlaced[over.id as number] = active.id as string;
                return newPlaced;
            });
            setEmotionOptions(prev => {
                const newOptions = [...prev];
                newOptions[over.id as number] = null;
                return newOptions;
            });
        }
    }

    function handleDragOver(event: DragOverEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    // function handleDrop(event: DropEvent) {
    //     setEmotionPlaced(event.active.id as string);
    // }

    return (
        <DndContext
        //   collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
            <img src="/game_bg.jpg" alt="Game" className="absolute inset-0 w-full h-full object-cover -z-10" />
            <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 z-10 w-[70vw] h-[70vh]">
                <img src="/test.svg" alt="Game" className="w-full h-full" />

                <div className="grid grid-cols-4 gap-10 absolute top-[10vh] left-1/2 -translate-x-1/2 z-10 h-[100px] w-[80%]">
                    {
                        emotionOptions.map((emotion, index) => (
                            emotion ? <DraggableItem key={index} id={emotion} className={`bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold ${
                                        index % 2 === 0 ? 'self-start' : 'self-end'
                                    }`}
                                >
                                    {emotion?.charAt(0).toUpperCase() + emotion?.slice(1)}

                            </DraggableItem> :
                            <div className={`h-[40px] ${
                                index % 2 === 0 ? 'self-start' : 'self-end'
                            }`}>
                            </div>
                        ))
                    }
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-4 gap-10 w-[80%]">
                {faceImages.map((image, index) => (
                    <DroppableAnswer key={index} id={index}>
                        <div className="w-[200px] h-[200px]">
                            <img key={index} src={image.src} alt="Face" className="h-full mb-10" />
                            {emotionPlaced[index] ? <DraggableItem key={index} id={emotionPlaced[index]} className={`bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold ${
                                        index % 2 === 0 ? 'self-start' : 'self-end'
                                    }`}
                                >
                                    {emotionPlaced[index]?.charAt(0).toUpperCase() + emotionPlaced[index]?.slice(1)}

                            </DraggableItem> : <div className="bg-white rounded-md w-full h-[40px]"/>}
                        </div>
                    </DroppableAnswer>
                ))}
                </div>
            </div>

            <DragOverlay>
                {draggedEmotion && (
                    <DraggableItem id={draggedEmotion} className="bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold">
                        {draggedEmotion?.charAt(0).toUpperCase() + draggedEmotion?.slice(1)}
                    </DraggableItem>
                )}
            </DragOverlay>
        </DndContext>
    )
}