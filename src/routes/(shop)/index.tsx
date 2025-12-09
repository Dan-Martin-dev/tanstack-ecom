import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { getCategories, queryFeaturedProductsWithLimit } from "~/lib/server/products";

export const Route = createFileRoute("/(shop)/")({
  loader: async () => {
    const [featuredProducts, categories] = await Promise.all([
      queryFeaturedProductsWithLimit(8),
      getCategories(),
    ]);
    return { featuredProducts, categories };
  },
  component: Homepage,
});

function formatPrice(priceInCentavos: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(priceInCentavos / 100);
}

function Homepage() {
  const { featuredProducts, categories } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="from-primary/10 via-primary/5 to-background bg-gradient-to-r py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Bienvenido a tu tienda online
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Descubrí los mejores productos con envío a todo el país. Pagá con Mercado Pago
            de forma segura.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/products">
              <Button size="lg">Ver productos</Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline">
                Explorar categorías
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">Productos destacados</h2>
              <Link to="/products" className="text-primary text-sm hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const mainImage =
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : "/placeholder-product.jpg";
                return (
                  <Link
                    key={product.slug}
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="group bg-card overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
                  >
                    <div className="bg-muted aspect-square overflow-hidden">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="group-hover:text-primary font-semibold">
                        {product.name}
                      </h3>
                      <p className="text-primary mt-1 text-lg font-bold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Explorá por categoría
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="bg-card hover:border-primary hover:bg-primary/5 flex items-center justify-center rounded-lg border p-6 text-center transition-colors"
                >
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features/Trust */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">🚚</div>
              <h3 className="mb-2 font-semibold">Envío a todo el país</h3>
              <p className="text-muted-foreground text-sm">
                Hacemos envíos a todas las provincias de Argentina
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">💳</div>
              <h3 className="mb-2 font-semibold">Pago seguro</h3>
              <p className="text-muted-foreground text-sm">
                Pagá con Mercado Pago, tarjetas o transferencia
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="mb-2 font-semibold">Garantía de calidad</h3>
              <p className="text-muted-foreground text-sm">
                Todos nuestros productos tienen garantía
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
