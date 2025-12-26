import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import type { CategoryWithChildren, ProductWithRelations } from "~/lib/server/products";
import { getCategories, queryProducts } from "~/lib/server/products";

// Search params schema for product filters
const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "name_asc", "name_desc"])
    .optional(),
  page: z.coerce.number().min(1).optional().default(1),
});

type ProductSearch = z.infer<typeof productSearchSchema>;

export const Route = createFileRoute("/(shop)/products/")({
  validateSearch: productSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [productsData, categories] = await Promise.all([
      queryProducts({
        search: deps.search,
        categorySlug: deps.category,
        minPrice: deps.minPrice ? deps.minPrice * 100 : undefined, // Convert to centavos
        maxPrice: deps.maxPrice ? deps.maxPrice * 100 : undefined,
        inStock: deps.inStock,
        sortBy: deps.sortBy,
        page: deps.page,
        limit: 12,
      }),
      getCategories(),
    ]);
    return { productsData, categories };
  },
  component: ProductsPage,
});

function formatPrice(centavos: number): string {
  return (centavos / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function ProductsPage() {
  const { productsData, categories } = Route.useLoaderData();
  const { products, total, page, totalPages } = productsData;
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Helper to update search params
  const updateFilters = (updates: Partial<ProductSearch>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
        // Reset to page 1 when filters change (unless we're changing page)
        page: "page" in updates ? updates.page : 1,
      }),
    });
  };

  // Price range options (in ARS, not centavos)
  const priceRanges = [
    { label: "Hasta $10.000", min: undefined, max: 10000 },
    { label: "$10.000 - $50.000", min: 10000, max: 50000 },
    { label: "$50.000 - $100.000", min: 50000, max: 100000 },
    { label: "Más de $100.000", min: 100000, max: undefined },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link to="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Productos</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 space-y-6">
            <div>
              <h3 className="mb-3 font-semibold">Categorías</h3>
              <ul className="space-y-2">
                {categories.map((cat: CategoryWithChildren) => (
                  <li key={cat.id}>
                    <Link
                      to="/categories/$slug"
                      params={{ slug: cat.slug }}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {cat.name}
                    </Link>
                    {cat.children.length > 0 && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {cat.children.map((sub: CategoryWithChildren) => (
                          <li key={sub.id}>
                            <Link
                              to="/categories/$slug"
                              params={{ slug: sub.slug }}
                              className="text-muted-foreground hover:text-foreground text-xs"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Precio</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => {
                  const isActive =
                    search.minPrice === range.min && search.maxPrice === range.max;
                  return (
                    <label key={range.label} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={isActive}
                        onChange={() => {
                          if (isActive) {
                            updateFilters({ minPrice: undefined, maxPrice: undefined });
                          } else {
                            updateFilters({ minPrice: range.min, maxPrice: range.max });
                          }
                        }}
                      />
                      {range.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Disponibilidad</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={search.inStock ?? false}
                    onChange={(e) =>
                      updateFilters({ inStock: e.target.checked || undefined })
                    }
                  />
                  En stock
                </label>
              </div>
            </div>

            {/* Clear filters */}
            {Boolean(
              search.minPrice ||
              search.maxPrice ||
              search.inStock ||
              search.category ||
              search.sortBy,
            ) && (
              <button
                onClick={() =>
                  navigate({
                    search: {},
                  })
                }
                className="text-primary text-sm hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Mostrando {products.length} de {total} productos
            </p>
            <select
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
              value={search.sortBy ?? ""}
              onChange={(e) =>
                updateFilters({
                  sortBy: (e.target.value || undefined) as ProductSearch["sortBy"],
                })
              }
            >
              <option value="">Más relevantes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
              <option value="newest">Más recientes</option>
              <option value="name_asc">A-Z</option>
              <option value="name_desc">Z-A</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                No hay productos disponibles.
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Volvé pronto para ver nuestras novedades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product: ProductWithRelations) => {
                const hasDiscount =
                  product.compareAtPrice != null &&
                  product.compareAtPrice > product.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((product.compareAtPrice! - product.price) /
                        product.compareAtPrice!) *
                        100,
                    )
                  : 0;
                const primaryImage = product.images[0];

                return (
                  <Link
                    key={product.id}
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="bg-card group rounded-lg border transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="bg-muted flex h-full w-full items-center justify-center">
                          <span className="text-muted-foreground text-4xl">📷</span>
                        </div>
                      )}
                      {hasDiscount && (
                        <span className="bg-destructive absolute top-2 left-2 rounded px-2 py-1 text-xs font-medium text-white">
                          -{discountPercent}%
                        </span>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs font-medium text-white">
                          ¡Últimas unidades!
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      {product.category && (
                        <p className="text-muted-foreground text-xs">
                          {product.category.name}
                        </p>
                      )}
                      {product.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          ${formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-muted-foreground text-sm line-through">
                            ${formatPrice(product.compareAtPrice!)}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">
                        12 cuotas de ${formatPrice(Math.round(product.price / 12))}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                className="border-input rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
              >
                ← Anterior
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "border-input"
                    }`}
                    onClick={() => updateFilters({ page: pageNum })}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="border-input rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
