import React from 'react';
import { useSpeechBubbleStore } from '@/stores/speechBubbleStore';
import SpeechBubble from './SpeechBubble';
import { cn } from '@/lib/utils';

interface SpeechBubbleManagerProps {
  className?: string;
}

const SpeechBubbleManager: React.FC<SpeechBubbleManagerProps> = ({
  className,
}) => {
  const { 
    bubbles, 
    isGloballyVisible, 
    nextMessage, 
    previousMessage 
  } = useSpeechBubbleStore();

  if (!isGloballyVisible) {
    return null;
  }

  const handleNavigate = (bubbleId: string, direction: 'next' | 'prev') => {
    if (direction === 'next') {
      nextMessage(bubbleId);
    } else {
      previousMessage(bubbleId);
    }
  };

  return (
    <div className={cn("pointer-events-none", className)}>
      {bubbles
        .filter((bubble) => bubble.isVisible)
        .map((bubble) => (
          <SpeechBubble
            key={bubble.id}
            messages={bubble.messages}
            currentMessageIndex={bubble.currentMessageIndex}
            position={bubble.position}
            characterImage={bubble.characterImage}
            characterPosition={bubble.characterPosition}
            size={bubble.size}
            variant={bubble.variant}
            maxWidth={bubble.maxWidth}
            zIndex={bubble.zIndex}
            showNavigation={bubble.showNavigation}
            autoPlay={bubble.autoPlay}
            className="pointer-events-auto"
            onNavigate={(direction) => handleNavigate(bubble.id, direction)}
            onAudioPlay={() => {
              // Optional: Add any global audio play handling here
              console.log(`Playing audio for bubble ${bubble.id}`);
            }}
          />
        ))}
    </div>
  );
};

export default SpeechBubbleManager; 