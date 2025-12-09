import { createFileRoute, Link } from "@tanstack/react-router";
import { getCategories } from "~/lib/server/products";

export const Route = createFileRoute("/(shop)/categories/")({
  loader: async () => {
    return await getCategories();
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const categories = Route.useLoaderData();

  // Filter to only show top-level categories (no parent)
  const topLevelCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link to="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Categorías</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <p className="text-muted-foreground mt-2">
          Explorá todas nuestras categorías de productos
        </p>
      </div>

      {topLevelCategories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topLevelCategories.map((category) => {
            // Find children for this category
            const children = categories.filter((c) => c.parentId === category.id);
            return (
              <Link
                key={category.slug}
                to="/categories/$slug"
                params={{ slug: category.slug }}
                className="group bg-card hover:border-primary rounded-lg border p-6 transition-all hover:shadow-lg"
              >
                <h2 className="group-hover:text-primary text-xl font-semibold">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {category.description}
                  </p>
                )}
                {children.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {children.slice(0, 3).map((child) => (
                      <span
                        key={child.slug}
                        className="bg-muted rounded-full px-2 py-1 text-xs"
                      >
                        {child.name}
                      </span>
                    ))}
                    {children.length > 3 && (
                      <span className="bg-muted rounded-full px-2 py-1 text-xs">
                        +{children.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg border py-16 text-center">
          <p className="text-muted-foreground">No hay categorías disponibles</p>
        </div>
      )}
    </div>
  );
}
