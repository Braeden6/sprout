import SpeechBubble from '@/components/SpeechBubble';
import { useSpeechBubbleStore } from '@/stores/speechBubbleStore';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { addMessage, clearMessages } = useSpeechBubbleStore();

  useEffect(() => {
    clearMessages();
    addMessage({
        text: "Hello! Welcome to Boom Land. My name is Sprout, and I am your new adventure friend. Here in Boom Land, we are secretly protecting the existing dinosaurs. To help us grow, you will play games, collect dinosaur eggs, and help nurturing the dinosaurs.",
        audioUrl: "/voices/landing_intro.wav"
    });
    addMessage({
      text: "Before we begin, let's create your own dinosaur.",
      audioUrl: "/voices/landing_create.wav"
  });

  }, [clearMessages, addMessage]);



  return (
    <div className="fixed inset-0 w-full h-full">
      <img 
        src="/landing_bg.png" 
        alt="Speech" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <SpeechBubble
          position={{ bottom: '80%', left: '60%' }}
          showNavigation
          size="xlarge"
          variant="primary"
      />
    </div>
  )
} 

export default Home;
