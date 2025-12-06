import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(authenticated)/account"!</div>;
}
