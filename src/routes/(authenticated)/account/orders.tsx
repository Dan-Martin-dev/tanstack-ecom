import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/account/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/account/orders"!</div>
}
