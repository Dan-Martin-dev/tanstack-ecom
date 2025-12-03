import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(shop)/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(shop)/categories/"!</div>
}
