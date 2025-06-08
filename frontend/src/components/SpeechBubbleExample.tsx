import React, { useState } from 'react';
import SpeechBubble from './SpeechBubble';
import SpeechBubbleManager from './SpeechBubbleManager';
import { useSpeechBubbleStore } from '@/stores/speechBubbleStore';
import type { SpeechMessage } from '@/stores/speechBubbleStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SpeechBubbleExample: React.FC = () => {
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const { 
    addTemporaryBubble, 
    addCharacterBubble,
    addBubble, 
    clearAllBubbles, 
    toggleGlobalVisibility, 
    isGloballyVisible 
  } = useSpeechBubbleStore();

  const handleAddTemporaryBubble = () => {
    const messages: SpeechMessage[] = [
      { text: "Hello! I'm a temporary speech bubble!" },
      { text: "I'll disappear in 5 seconds!" },
      { text: "Click me again for more bubbles!" },
      { text: "This one has different positioning!" },
      { text: "Temporary bubbles are great for notifications!" }
    ];
    
    const positions = [
      { top: Math.random() * 300 + 100, left: Math.random() * 400 + 100 },
      { top: Math.random() * 300 + 100, right: Math.random() * 400 + 100 },
      { bottom: Math.random() * 200 + 100, left: Math.random() * 400 + 100 },
      { bottom: Math.random() * 200 + 100, right: Math.random() * 400 + 100 },
    ];

    const variants: ('default' | 'muted' | 'accent')[] = ['default', 'muted', 'accent'];
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

    const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

    addTemporaryBubble(
      [selectedMessage],
      positions[Math.floor(Math.random() * positions.length)],
      {
        variant: variants[Math.floor(Math.random() * variants.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        duration: 5000,
      }
    );
  };

  const handleAddCharacterBubble = () => {
    const characterMessages: SpeechMessage[] = [
      { 
        text: "Hi there! I'm a character with voice!", 
        audioUrl: "/audio/greeting.wav" // You'll need to add actual audio files
      },
      { 
        text: "Click on me to hear my voice!", 
        audioUrl: "/audio/click-me.wav" 
      },
      { 
        text: "Use the navigation arrows to browse messages!", 
        audioUrl: "/audio/navigate.wav" 
      },
      { 
        text: "I can have multiple messages with different voices!", 
        audioUrl: "/audio/multiple.wav" 
      }
    ];

    const characterImages = [
      "/images/character1.png", // You'll need to add actual character images
      "/images/character2.png",
      "/images/character3.png"
    ];

    const positions = [
      { top: 100, left: 100 },
      { top: 150, right: 150 },
      { bottom: 200, left: 200 },
      { bottom: 150, right: 100 }
    ];

    addCharacterBubble(
      characterMessages,
      characterImages[Math.floor(Math.random() * characterImages.length)],
      positions[Math.floor(Math.random() * positions.length)],
      {
        variant: 'default',
        size: 'medium',
        characterPosition: ['left', 'right', 'top', 'bottom'][Math.floor(Math.random() * 4)] as 'left' | 'right' | 'top' | 'bottom',
        autoPlay: false,
        duration: 0, // Permanent
      }
    );
  };

  const handleAddPermanentBubble = () => {
    const multiMessages: SpeechMessage[] = [
      { text: "I'm a permanent bubble with multiple messages!" },
      { text: "Use the arrow buttons to navigate between messages." },
      { text: "This is message 3 of 4." },
      { text: "Last message! Use the clear button to remove me." }
    ];

    addBubble({
      messages: multiMessages,
      position: { 
        top: 50 + Math.random() * 200, 
        left: 50 + Math.random() * 300 
      },
      variant: 'accent',
      size: 'medium',
      duration: 0, // Permanent
      showNavigation: true,
    });
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Control Panel */}
      <Card className="absolute top-4 left-4 p-4 z-[2000] bg-white/90 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm">Speech Bubble Controls</h3>
          
          <Button
            onClick={() => setShowStaticBubbles(!showStaticBubbles)}
            variant="outline"
            size="sm"
          >
            {showStaticBubbles ? 'Hide Static' : 'Show Static'}
          </Button>
          
          <Button
            onClick={toggleGlobalVisibility}
            variant="outline"
            size="sm"
          >
            {isGloballyVisible ? 'Hide Store' : 'Show Store'}
          </Button>
          
          <Button
            onClick={handleAddTemporaryBubble}
            size="sm"
          >
            Add Temp Bubble
          </Button>
          
          <Button
            onClick={handleAddCharacterBubble}
            variant="secondary"
            size="sm"
          >
            Add Character
          </Button>
          
          <Button
            onClick={handleAddPermanentBubble}
            variant="secondary"
            size="sm"
          >
            Add Multi-Message
          </Button>
          
          <Button
            onClick={clearAllBubbles}
            variant="destructive"
            size="sm"
          >
            Clear All Store
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="absolute top-4 right-4 p-4 z-[2000] bg-white/90 backdrop-blur-sm max-w-xs">
        <div className="text-sm space-y-2">
          <h4 className="font-semibold">Features:</h4>
          <ul className="text-xs space-y-1">
            <li>• Click bubbles with audio to play sound</li>
            <li>• Use arrow buttons for multi-messages</li>
            <li>• Character images position automatically</li>
            <li>• Temporary bubbles auto-disappear</li>
            <li>• Different variants and sizes available</li>
          </ul>
        </div>
      </Card>

      {/* Static Speech Bubbles */}
      {showStaticBubbles && (
        <>
          {/* Simple bubble */}
          <SpeechBubble
            messages={[{ text: "Hello! I'm a simple speech bubble." }]}
            position={{ top: 80, left: 50 }}
            size="small"
            variant="primary"
          />

          {/* Multi-message bubble with navigation */}
          <SpeechBubble
            messages={[
              { text: "I have multiple messages!" },
              { text: "Use the arrows below to navigate." },
              { text: "This is the third message." },
              { text: "And this is the last one!" }
            ]}
            position={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)' 
            }}
            size="medium"
            variant="muted"
            showNavigation={true}
          />

          {/* Character bubble (you'll need to add an actual image) */}
          <SpeechBubble
            messages={[
              { 
                text: "Hi! I'm a character bubble!", 
                audioUrl: "/audio/greeting.wav"
              }
            ]}
            position={{ bottom: 100, right: 100 }}
            characterImage="/images/character.png" 
            characterPosition="left"
            size="large"
            variant="accent"
          />

          {/* Long text example */}
          <SpeechBubble
            messages={[{ 
              text: "This demonstrates how the speech bubble automatically adjusts font size based on content length while maintaining readability and proper styling with Tailwind CSS." 
            }]}
            position={{ top: '20%', right: 50 }}
            size="medium"
            maxWidth={350}
            variant="primary"
          />
        </>
      )}

      {/* Store-managed Speech Bubbles */}
      <SpeechBubbleManager />
    </div>
  );
};

export default SpeechBubbleExample; 