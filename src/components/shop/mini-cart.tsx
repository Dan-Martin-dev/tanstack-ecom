import { Link } from "@tanstack/react-router";
import { useCart } from "~/lib/cart/cart-store";
import { Button } from "~/components/ui/button";

export function MiniCart() {
  const { state, itemCount, subtotal, removeItem, updateQuantity, setCartOpen } =
    useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart sidebar */}
      <div className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-md shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <h2 className="text-lg font-semibold">
              Carrito ({itemCount})
            </h2>
            <button
              onClick={() => setCartOpen(false)}
              className="hover:bg-muted rounded-full p-2"
            >
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="text-6xl">🛒</span>
                <h3 className="mt-4 font-medium">Tu carrito está vacío</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Agregá productos para comenzar
                </p>
                <Link to="/products" onClick={() => setCartOpen(false)}>
                  <Button className="mt-4">Ver productos</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <Link
                        to="/products/$slug"
                        params={{ slug: item.slug }}
                        onClick={() => setCartOpen(false)}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 font-bold">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="bg-muted flex h-6 w-6 items-center justify-center rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="bg-muted flex h-6 w-6 items-center justify-center rounded disabled:opacity-50"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive ml-auto text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-muted-foreground mb-4 text-xs">
                El envío se calcula en el checkout
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/cart" onClick={() => setCartOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Ver carrito
                  </Button>
                </Link>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full">Ir a pagar</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
