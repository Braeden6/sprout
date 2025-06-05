import { DndContext, DragOverlay, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/GameLayout';
import { useTimerStore } from '@/stores/timerStore';
import { useHelpButtonStore } from '@/stores/helpButtonStore';
import { DroppableAnswer } from '@/components/DroppableAnswer';
import { DraggableItem } from '@/components/DraggableItem';

export const Route = createFileRoute('/games/face')({
    component: Face,
})

function Face() {
    const { timeLeft, startTimer } = useTimerStore();
    const { enableHelp } = useHelpButtonStore();
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
    const [shakeItem, setShakeItem] = useState<number | null>(null);
    const actualEmotions = [
        'surprised',
        'angry',
        'sad',
        'happy'
    ];

    // tech debt: get images/emotions/etc from backend
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
        startTimer(60 * 5);
        loadImages();
        enableHelp(3, () => {
            console.log("Help button clicked");
        });

    }, [])

    function handleDragStart(event: DragStartEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setDraggedEmotion(null);
        const { active, over } = event;

        if (timeLeft > 0 && over) {
            if (actualEmotions[over.id as number] === active.id as string) {
                const emotionIndex = emotionOptions.indexOf(active.id as string);
                setEmotionPlaced(prev => {
                    const newPlaced = [...prev];
                    newPlaced[over.id as number] = active.id as string;
                    return newPlaced;
                });
                setEmotionOptions(prev => {
                    const newOptions = [...prev];
                    newOptions[emotionIndex] = null;
                    return newOptions;
                });
            } else {
                setShakeItem(over.id as number);
                setTimeout(() => setShakeItem(null), 600);
            }
        }
    }

    function handleDragOver(event: DragOverEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    return (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
            <GameLayout showTimer>
                <div className="grid grid-cols-4 gap-10 absolute top-[10vh] left-1/2 -translate-x-1/2 z-10 h-[100px] w-[80%]">
                    {
                        emotionOptions.map((emotion, index) => (
                            emotion ? <DraggableItem key={index} id={emotion} className={`bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold ${
                                        index % 2 === 0 ? 'self-start' : 'self-end'
                                    }`}
                                >
                                    {emotion?.charAt(0).toUpperCase() + emotion?.slice(1)}

                            </DraggableItem> :
                            <div key={index} className="h-[40px]"/>
                        ))
                    }
                </div>

                <div className="absolute top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-4 gap-10 w-[80%]">
                    {faceImages.map((image, index) => (
                        <DroppableAnswer 
                            key={index} 
                            id={index} 
                            isEmpty={!emotionPlaced[index]} 
                            shouldShake={shakeItem === index}
                            className="flex flex-col w-[200px]"
                        >
                            <img key={index} src={image.src} alt="Face" className="h-[200px] w-full mb-10" />
                            {
                                emotionPlaced[index] ? 
                                    <div className=" bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold w-full">
                                        {emotionPlaced[index]?.charAt(0).toUpperCase() + emotionPlaced[index]?.slice(1)}
                                    </div> : 
                                    <div className="bg-white rounded-md w-full h-[40px]"/>
                            }
                        </DroppableAnswer>
                    ))}
                </div>
            </GameLayout>

            <DragOverlay>
                {draggedEmotion && (
                    <div className="bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold">
                        {draggedEmotion?.charAt(0).toUpperCase() + draggedEmotion?.slice(1)}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}