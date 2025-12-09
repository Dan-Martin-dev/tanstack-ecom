import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCartStore } from "~/lib/cart/cart-store";
import { queryProductBySlug } from "~/lib/server/products";

export const Route = createFileRoute("/(shop)/products/$slug")({
  loader: async ({ params }) => {
    const product = await queryProductBySlug(params.slug);
    if (!product) {
      throw notFound();
    }
    return product;
  },
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold">Producto no encontrado</h1>
      <p className="text-muted-foreground mb-8">
        El producto que buscas no existe o fue eliminado.
      </p>
      <Link to="/products">
        <Button>Ver todos los productos</Button>
      </Link>
    </div>
  ),
});

function formatPrice(priceInCentavos: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(priceInCentavos / 100);
}

function ProductDetailPage() {
  const product = Route.useLoaderData();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const [quantity, setQuantity] = useState(1);

  const inStock = product.stock > 0;
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/placeholder-product.jpg";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: mainImage,
      maxStock: product.stock,
    });
    toast.success(`${product.name} agregado al carrito`);
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Inicio
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li>
            <Link to="/products" className="text-muted-foreground hover:text-primary">
              Productos
            </Link>
          </li>
          {product.category != null && (
            <>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link
                  to="/categories/$slug"
                  params={{ slug: product.category.slug }}
                  className="text-muted-foreground hover:text-primary"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li className="text-muted-foreground">/</li>
          <li className="font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  className="hover:border-primary h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border"
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - imagen ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.category != null && (
              <Link
                to="/categories/$slug"
                params={{ slug: product.category.slug }}
                className="text-muted-foreground hover:text-primary text-sm"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <p className="text-muted-foreground text-lg line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
            <p className="text-primary text-3xl font-bold">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className={inStock ? "text-green-600" : "text-red-600"}>
              {inStock
                ? product.stock > 10
                  ? "En stock"
                  : `Solo ${product.stock} disponibles`
                : "Sin stock"}
            </span>
          </div>

          {/* Description */}
          {product.description != null && (
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center rounded-md border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="hover:bg-muted px-4 py-2 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="hover:bg-muted px-4 py-2 disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? "Agregar al carrito" : "Sin stock"}
            </Button>
          </div>

          {/* SKU */}
          {product.sku != null && (
            <p className="text-muted-foreground text-sm">SKU: {product.sku}</p>
          )}
        </div>
      </div>
    </div>
  );
}
