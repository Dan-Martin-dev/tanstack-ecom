import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/")({
  component: Homepage,
});

function Homepage() {
  return <div>Helloss "/(shop)/"!</div>;
}
