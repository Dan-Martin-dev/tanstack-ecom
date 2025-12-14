import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(auth-pages)")({
  component: RouteComponent,
  errorComponent: DefaultCatchBoundary,
  pendingComponent: () => (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  ),
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/dashboard";

    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    if (user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }

    return {
      redirectUrl: REDIRECT_URL,
    };
  },
});

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
        hi
      </div>
    </div>
  );
}
