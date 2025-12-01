import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(authenticated)")({
  component: Outlet,
  errorComponent: DefaultCatchBoundary,
  pendingComponent: () => (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-muted-foreground">Checking authentication...</div>
    </div>
  ),
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    if (!user) {
      throw redirect({ to: "/login" });
    }

    // re-return to update type as non-null for child routes
    return { user };
  },
});
