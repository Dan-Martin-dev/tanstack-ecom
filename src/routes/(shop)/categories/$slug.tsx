import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { queryCategoryBySlug } from "~/lib/server/products";

export const Route = createFileRoute("/(shop)/categories/$slug")({
  loader: async ({ params }) => {
    const result = await queryCategoryBySlug(params.slug);
    if (!result) {
      throw notFound();
    }
    return result;
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold">Categoría no encontrada</h1>
      <p className="text-muted-foreground mb-8">
        La categoría que buscas no existe o fue eliminada.
      </p>
      <Link to="/categories">
        <Button>Ver todas las categorías</Button>
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

function CategoryPage() {
  const { category, products: productsData } = Route.useLoaderData();
  const products = productsData.products;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link to="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link to="/categories" className="hover:text-foreground">
          Categorías
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description != null && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          {productsData.total} producto{productsData.total !== 1 ? "s" : ""} encontrado
          {productsData.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Subcategories */}
      {category.children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {category.children.map((sub) => (
            <Link
              key={sub.slug}
              to="/categories/$slug"
              params={{ slug: sub.slug }}
              className="border-input hover:border-primary rounded-full border px-4 py-2 text-sm transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const mainImage =
              product.images && product.images.length > 0
                ? product.images[0].url
                : "/placeholder-product.jpg";
            return (
              <Link
                key={product.slug}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group bg-card rounded-lg border transition-shadow hover:shadow-lg"
              >
                <div className="bg-muted relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  {product.description != null && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <p className="text-primary text-lg font-bold">
                      {formatPrice(product.price)}
                    </p>
                    {product.compareAtPrice != null &&
                      product.compareAtPrice > product.price && (
                        <p className="text-muted-foreground text-sm line-through">
                          {formatPrice(product.compareAtPrice)}
                        </p>
                      )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg border py-16 text-center">
          <p className="text-muted-foreground">No hay productos en esta categoría</p>
          <Link to="/products" className="mt-4 inline-block">
            <Button variant="outline">Ver todos los productos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
