import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    inStock?: boolean;
    rating?: number;
    reviewCount?: number;
  };
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  showQuickActions?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  showQuickActions = true,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const inStock = product.inStock !== false;

  return (
    <div className="bg-card group overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="rounded bg-gray-500 px-2 py-0.5 text-xs font-medium text-white">
              Sin stock
            </span>
          )}
        </div>

        {/* Quick actions */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onAddToWishlist?.(product.id)}
              className="bg-background/90 hover:bg-background rounded-full p-2 shadow transition-colors"
              title="Agregar a favoritos"
            >
              ❤️
            </button>
          </div>
        )}

        {/* Add to cart overlay */}
        {showQuickActions && inStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-2 transition-transform group-hover:translate-y-0">
            <Button
              className="w-full"
              size="sm"
              onClick={() => onAddToCart?.(product.id)}
            >
              Agregar al carrito
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 font-medium hover:underline"
        >
          {product.name}
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm">{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="text-muted-foreground text-xs">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Installments (common in Argentina) */}
        <p className="text-muted-foreground mt-1 text-xs">
          6 cuotas sin interés de {formatPrice(Math.round(product.price / 6))}
        </p>
      </div>
    </div>
  );
}
