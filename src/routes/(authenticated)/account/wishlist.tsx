import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/account/wishlist')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/account/wishlist"!</div>
}
