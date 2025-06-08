import { createFileRoute } from '@tanstack/react-router'
import SpeechBubbleExample from '@/components/SpeechBubbleExample'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <SpeechBubbleExample />
  )
} 