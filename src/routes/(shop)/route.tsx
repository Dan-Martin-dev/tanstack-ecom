import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ShopHeader } from "~/components/shop/shop-header";
import { ShopFooter } from "~/components/shop/shop-footer";
import { MiniCart } from "~/components/shop/mini-cart";

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
      <MiniCart />
    </div>
  );
}
