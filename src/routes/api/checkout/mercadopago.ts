import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/checkout/mercadopago')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/checkout/mercadopago"!</div>
}
