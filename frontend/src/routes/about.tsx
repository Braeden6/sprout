import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>About Sprout</CardTitle>
          <CardDescription>Learn more about this application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a modern React application built with:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• React + TypeScript</li>
            <li>• Vite for build tooling</li>
            <li>• Zustand for state management</li>
            <li>• TanStack Router for routing</li>
            <li>• TanStack Query for data fetching</li>
            <li>• shadcn/ui for components</li>
            <li>• Tailwind CSS for styling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 