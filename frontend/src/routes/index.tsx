import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.log('Audio autoplay blocked by browser:', error);
        }
      }
    };

    playAudio();
  }, []);

  const handleUserInteraction = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.log('Error playing audio:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4" onClick={handleUserInteraction}>
      <audio 
        ref={audioRef}
        src="/voices/landing.wav" 
        // loop 
        preload="auto"
      />

      <img src="/landing_bg.png" alt="Speech" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-[15vh] left-[60vw] z-10 w-[380px] h-[180px] border">
      <img src="/speech_dubble.svg" alt="Speech" className="w-full h-full -translate-x-[20px] border" />
        <div className="absolute inset-0 flex items-center justify-center ps-15">
          <p className="text-md">Hello! Welcome to Boom Land. My name is Sprout, and I am your new adventure friend. 
          Here in Boom Land, we are secretly protecting the existing dinosaurs. To help us grow, you will play games, collect dinosaur eggs, and help nurturing the dinosaurs. </p>
        </div>
      </div>
    </div>
  )
} 