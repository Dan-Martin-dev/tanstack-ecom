import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(shop)/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(shop)/search"!</div>
}
