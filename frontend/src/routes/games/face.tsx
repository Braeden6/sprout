import { DndContext, DragOverlay, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { GameLayout } from '@/components/GameLayout';
import { useTimerStore } from '@/stores/timerStore';
import { useHelpButtonStore } from '@/stores/helpButtonStore';
import { DroppableAnswer } from '@/components/DroppableAnswer';
import { DraggableItem } from '@/components/DraggableItem';
import { GamesFaceService } from '@/api/generated';
import SpeechBubble from '@/components/SpeechBubble';
import html2canvas from 'html2canvas-pro';
import { useSpeechBubbleStore } from '@/stores/speechBubbleStore';
import { Button } from '@/components/ui/button';
import useLoadingStore from '@/stores/loadingStore';

export const Route = createFileRoute('/games/face')({
    component: Face,
})

async function dataURLtoBlob(dataURL: string): Promise<Blob> {
    const res = await fetch(dataURL);
    return res.blob();
}

function Face() {
    const { isLoading, setIsLoading } = useLoadingStore();
    const { timeLeft, startTimer } = useTimerStore();
    const { enableHelp } = useHelpButtonStore();
    const [faceImages, setFaceImage] = useState<HTMLImageElement[]>([]);
    const [emotionOptions, setEmotionOptions] = useState<(string|null)[]>();
    const [sessionId, setSessionId] = useState<string|null>(null);
    const [draggedEmotion, setDraggedEmotion] = useState<string|null>(null);
    const [emotionPlaced, setEmotionPlaced] = useState<(string|null)[]>([null, null, null,null]);
    const [shakeItem, setShakeItem] = useState<number | null>(null);
    const [answer, setAnswer] = useState<string[]|null>(null);
    const page = useRef<HTMLDivElement>(null);
    const { addMessage, setInitialMessage, goToLastMessage } = useSpeechBubbleStore();

    const executeGameAction = async (
        sessionId: string, 
        sdkFunction: (sessionId: string, requestBody: { image: Blob }) => Promise<{ audio: string; text: string }>
    ) => {
        const canvas = await html2canvas(document.body);
        const screenshot = canvas.toDataURL('image/png');
        if (!screenshot) return;
        const imageBlob = await dataURLtoBlob(screenshot);
        setIsLoading(true);
        const response = await sdkFunction(sessionId, { image: imageBlob });
        const audioBlob = await fetch(`data:audio/wav;base64,${response.audio}`).then(res => res.blob());
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        addMessage({ text: response.text, audioUrl: audioUrl });
        goToLastMessage();
        setIsLoading(false);
    }

    const getHelp = async (sessionId: string) => {
        await executeGameAction(sessionId, GamesFaceService.getHelpGamesFaceSessionIdHelpPost);
    }

    const finishGame = async (sessionId: string) => {
        await executeGameAction(sessionId, GamesFaceService.finishGameGamesFaceSessionIdFinishPost);
    }

    useEffect(() => {
        const initGame = async () => {
            const response = await GamesFaceService.initGameGamesFaceInitGet();
            setAnswer(response.emotions);
            setEmotionOptions(response.emotion_options);
            const imagePromises = response.image_paths.map(url => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = url;
                });
            });
            const loadedImages = await Promise.all(imagePromises);
            setFaceImage(loadedImages);
            setSessionId(response.session_id);
            startTimer(60 * 5);
            enableHelp(3, () => getHelp(response.session_id));
            setInitialMessage({
                text: "Match each character's facial expression with a word from above.",
                audioUrl: "/voices/games/face/start.wav"
            });
        }

        initGame();
    }, [startTimer, enableHelp]);

    function handleDragStart(event: DragStartEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setDraggedEmotion(null);
        const { active, over } = event;

        if (timeLeft > 0 && over) {
            if (answer?.[over.id as number] === active.id as string) {
                const emotionIndex = emotionOptions?.indexOf(active.id as string);
                setEmotionPlaced(prev => {
                    const newPlaced = [...prev];
                    newPlaced[over.id as number] = active.id as string;
                    return newPlaced;
                });
                setEmotionOptions(prev => {
                    const newOptions = [...(prev ?? [])];
                    newOptions[emotionIndex ?? 0] = null;
                    return newOptions;
                });
                if (sessionId) {
                    GamesFaceService.matchEmotionGamesFaceSessionIdMatchPost(sessionId, active.id as string, true);
                }
            } else {
                if (sessionId) {
                    GamesFaceService.matchEmotionGamesFaceSessionIdMatchPost(sessionId, active.id as string, false);
                }
                setShakeItem(over.id as number);
                setTimeout(() => setShakeItem(null), 600);
            }
        }
    }

    function handleDragOver(event: DragOverEvent) {
        setDraggedEmotion(event.active.id as string);
    }

    return (
        <div ref={page}>
            <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            >
                <GameLayout showTimer>
                    <div className="grid grid-cols-4 gap-10 absolute top-[10vh] left-1/2 -translate-x-1/2 z-10 h-[100px] w-[80%]">
                        {
                            emotionOptions?.map((emotion, index) => (
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

                    <Button 
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-purple-900 px-10"
                        onClick={() => finishGame(sessionId ?? "")}
                        disabled={isLoading || !sessionId || emotionPlaced.some(emotion => emotion === null)}
                    >Finish</Button>
                </GameLayout>

                <SpeechBubble
                    position={{ bottom: 100, left: 40 }}
                    showNavigation
                    characterImage="/characters/sprout_side.png" 
                    characterPosition="left"
                    size="large"
                    variant="primary"
                />

                <DragOverlay>
                    {draggedEmotion && (
                        <div className="bg-blue-300 rounded-md h-[40px] flex text-center justify-center items-center text-2xl font-bold">
                            {draggedEmotion?.charAt(0).toUpperCase() + draggedEmotion?.slice(1)}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    )
}