import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/order-confirmation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(shop)/order-confirmation"!</div>;
}
