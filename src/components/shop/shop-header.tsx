import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import { authQueryOptions } from "~/lib/auth/queries";
import { useCartStore, useCartItemCount } from "~/lib/cart/cart-store";

export function ShopHeader() {
  const itemCount = useCartItemCount();
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5 text-center text-sm">
        🚚 Envío gratis en compras mayores a $50.000
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold">TanStack Shop</span>
          </Link>

          {/* Search bar */}
          <div className="hidden flex-1 max-w-xl md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="border-input bg-background w-full rounded-full border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                🔍
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Suspense fallback={<UserButtonSkeleton />}>
              <UserButton />
            </Suspense>

            <button
              onClick={toggleCart}
              className="hover:bg-accent relative flex h-9 w-9 items-center justify-center rounded-md"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <input
            type="search"
            placeholder="Buscar productos..."
            className="border-input bg-background w-full rounded-full border px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Categories nav */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 overflow-x-auto py-2 text-sm">
            <li>
              <Link
                to="/categories"
                className="text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Todas las categorías
              </Link>
            </li>
            {["Electrónica", "Ropa", "Hogar", "Deportes", "Ofertas"].map(
              (cat) => (
                <li key={cat}>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: cat.toLowerCase() }}
                    className={`whitespace-nowrap ${
                      cat === "Ofertas"
                        ? "text-destructive font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function UserButton() {
  const { data: user } = useSuspenseQuery(authQueryOptions());

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Ingresar</Link>
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/signup">Crear cuenta</Link>
        </Button>
      </div>
    );
  }

  return (
    <Link
      to="/dashboard"
      className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2"
    >
      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
        {user.name?.charAt(0).toUpperCase() || "U"}
      </div>
      <span className="hidden text-sm font-medium sm:inline">
        {user.name?.split(" ")[0] || "Mi cuenta"}
      </span>
    </Link>
  );
}

function UserButtonSkeleton() {
  return (
    <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
  );
}
