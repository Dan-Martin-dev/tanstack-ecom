import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/account/addresses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/account/addresses"!</div>
}
