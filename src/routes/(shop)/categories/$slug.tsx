import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/categories/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

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
        <span className="text-foreground">{categoryName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="text-muted-foreground mt-2">
          Encontrá los mejores productos de {categoryName.toLowerCase()}
        </p>
      </div>

      {/* Subcategories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["Subcategoría 1", "Subcategoría 2", "Subcategoría 3", "Subcategoría 4"].map(
          (sub) => (
            <button
              key={sub}
              className="border-input hover:border-primary rounded-full border px-4 py-2 text-sm transition-colors"
            >
              {sub}
            </button>
          ),
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Link
            key={i}
            to="/products/$slug"
            params={{ slug: `${slug}-product-${i + 1}` }}
            className="bg-card group rounded-lg border transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <div className="bg-muted h-full w-full transition-transform group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">
                Producto de {categoryName} #{i + 1}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                Descripción del producto
              </p>
              <p className="mt-3 text-lg font-bold">
                ${((i + 1) * 8500).toLocaleString("es-AR")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
