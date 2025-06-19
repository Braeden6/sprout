import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useSpeechBubbleStore } from '@/stores/speechBubbleStore';

interface SpeechBubbleProps {
  position?: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    transform?: string;
  };
  characterImage?: string;
  characterPosition?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
  textClassName?: string;
  maxWidth?: number;
  zIndex?: number;
  variant?: 'primary' | 'muted' | 'accent';
  showNavigation?: boolean;
  autoPlay?: boolean;
  onAudioPlay?: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  position = {},
  characterImage,
  characterPosition = 'left',
  size = 'medium',
  className,
  textClassName,
  maxWidth = 300,
  zIndex = 1000,
  variant = 'default',
  showNavigation = false,
  autoPlay = false,
  onAudioPlay,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { messages, currentMessageIndex, isNextMessageAvailable, isPreviousMessageAvailable, nextMessage, previousMessage } = useSpeechBubbleStore();
  const getScale = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 0.6;
      case 'medium': return 1;
      case 'large': return 1.4;
      default: return 1;
    }
  };

  const scale = getScale();
  const baseWidth = 598 * scale;
  const baseHeight = 271 * scale;
  const characterWidth = Math.min(baseWidth * 0.3, 100 * scale);
  const characterHeight = Math.min(baseWidth * 0.4, 120 * scale);

  const getFontSizeClass = () => {
    const textLength = messages[currentMessageIndex]?.text.length || 0;
    
    if (size === 'small') {
      if (textLength > 100) return 'text-xs';
      if (textLength > 50) return 'text-sm';
      return 'text-sm';
    }
    
    if (size === 'large') {
      if (textLength > 100) return 'text-base';
      if (textLength > 50) return 'text-lg';
      return 'text-xl';
    }
    
    if (textLength > 100) return 'text-sm';
    if (textLength > 50) return 'text-base';
    return 'text-base';
  };

  const getBubbleColor = () => {
    switch (variant) {
      case 'primary': return '#34CDF5';
      case 'muted': return '#6B7280'; 
      case 'accent': return '#8B5CF6'; 
      default: return '#34CDF5';
    }
  };

  const getLayoutStyles = () => {
    const bubbleWidth = Math.min(baseWidth, maxWidth);
    const bubbleHeight = baseHeight * (bubbleWidth / baseWidth);
    
    const containerStyles: React.CSSProperties = {
      zIndex,
      ...position,
    };

    let bubbleStyles: React.CSSProperties = {};
    let characterStyles: React.CSSProperties = {};

    switch (characterPosition) {
      case 'left':
        containerStyles.width = bubbleWidth + characterWidth + 20;
        containerStyles.height = Math.max(bubbleHeight, characterHeight);
        characterStyles = {
          left: 0,
          top: '50%',
          transform: 'translateY(-20%)',
        };
        bubbleStyles = {
          left: characterWidth + 20,
          top: 0,
        };
        break;
      case 'right':
        containerStyles.width = bubbleWidth + characterWidth + 20;
        containerStyles.height = Math.max(bubbleHeight, characterHeight);
        characterStyles = {
          right: 0,
          top: '50%',
          transform: 'translateY(-20%)',
        };
        bubbleStyles = {
          right: characterWidth + 20,
          top: 0,
        };
        break;
      case 'top':
        containerStyles.width = Math.max(bubbleWidth, characterWidth);
        containerStyles.height = bubbleHeight + characterHeight + 20;
        characterStyles = {
          top: 0,
          left: '50%',
          transform: 'translateX(-520%)',
        };
        bubbleStyles = {
          bottom: 0,
          left: '50%',
          transform: 'translateX(-20%)',
        };
        break;
      case 'bottom':
        containerStyles.width = Math.max(bubbleWidth, characterWidth);
        containerStyles.height = bubbleHeight + characterHeight + 20;
        characterStyles = {
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        };
        bubbleStyles = {
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        };
        break;
    }

    return {
      container: containerStyles,
      bubble: {
        ...bubbleStyles,
        width: bubbleWidth,
        height: bubbleHeight,
      },
      character: {
        ...characterStyles,
        width: characterWidth,
        height: characterHeight,
      },
    };
  };

  const styles = characterImage ? getLayoutStyles() : {
    container: { zIndex, ...position },
    bubble: {
      width: Math.min(baseWidth, maxWidth),
      height: baseHeight * (Math.min(baseWidth, maxWidth) / baseWidth),
    },
    character: {},
  };

  const playAudio = async () => {
    if (!messages[currentMessageIndex]?.audioUrl || !audioRef.current) return;

    try {
      setIsPlaying(true);
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      onAudioPlay?.();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (autoPlay && messages[currentMessageIndex]?.audioUrl) {
      playAudio();
    }
  }, [currentMessageIndex, autoPlay]);

  return (
    <div
      className={cn("absolute", className)}
      style={styles.container}
    >
      {/* Character Image */}
      {characterImage && (
        <div
          className="absolute"
          style={styles.character}
        >
          <img
            src={characterImage}
            alt="Character"
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Speech Bubble */}
      <div
        className="absolute cursor-pointer group"
        style={styles.bubble}
        onClick={messages[currentMessageIndex]?.audioUrl ? playAudio : undefined}
      >
        {/* SVG Background */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full transition-transform group-hover:scale-105"
          viewBox="0 0 598 271"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M564.919 34.4602C519.553 -16.759 128.538 -5.89443 98.2938 34.4602C68.0495 74.8149 97.2136 177.253 83.1716 198.207C69.1297 219.16 48.2223 237.519 0 251.754C67.0928 272.263 93.0795 258.395 104.775 257.963C116.47 257.53 534.675 291.333 570.32 251.754C605.965 212.176 610.285 85.6795 564.919 34.4602Z"
            fill={getBubbleColor()}
          />
        </svg>
        
        {/* Text Content */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center font-medium text-white break-words leading-tight overflow-y-auto h-[80%] w-[60%]",
            getFontSizeClass(),
            textClassName
          )}
        >
          <div className="w-full text-center">
            {messages[currentMessageIndex]?.text}
          </div>
        </div>

        {/* Audio Indicator */}
        {messages[currentMessageIndex]?.audioUrl && (
          <div className="absolute top-4 right-4">
            <Volume2 
              className={cn(
                "w-4 h-4 text-white transition-colors",
                isPlaying ? "animate-pulse text-yellow-300" : "opacity-70"
              )} 
            />
          </div>
        )}

        {/* Navigation Controls */}
        {showNavigation && messages.length > 1 && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                previousMessage();
              }}
              disabled={!isPreviousMessageAvailable()}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            
            <span className="text-xs text-white px-1 py-0.5 bg-black/20 rounded">
              {currentMessageIndex + 1}/{messages.length}
            </span>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                nextMessage();
              }}
              disabled={!isNextMessageAvailable()}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Audio Element */}
      {messages[currentMessageIndex]?.audioUrl && (
        <audio
          ref={audioRef}
          src={messages[currentMessageIndex]?.audioUrl}
          onEnded={handleAudioEnded}
          preload="metadata"
        />
      )}
    </div>
  );
};

export default SpeechBubble; 