import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MiniCart } from "~/components/shop/mini-cart";
import { ShopFooter } from "~/components/shop/shop-footer";
import { ShopHeader } from "~/components/shop/shop-header";

export const Route = createFileRoute("/(shop)")({
  component: ShopLayout,
});

function ShopLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ShopHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <ShopFooter />
            <ClientOnly>
        <MiniCart />
      </ClientOnly>
    </div>
  );
}
