import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(shop)/products/")({
  component: ProductsPage,
});

function ProductsPage() {
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
                {["Electrónica", "Ropa", "Hogar", "Deportes"].map((cat) => (
                  <li key={cat}>
                    <Link
                      to="/categories/$slug"
                      params={{ slug: cat.toLowerCase() }}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Precio</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Hasta $10.000
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  $10.000 - $50.000
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  $50.000 - $100.000
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Más de $100.000
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Disponibilidad</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  En stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Envío gratis
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Mostrando 1-12 de 48 productos
            </p>
            <select className="border-input bg-background rounded-md border px-3 py-2 text-sm">
              <option>Más relevantes</option>
              <option>Menor precio</option>
              <option>Mayor precio</option>
              <option>Más recientes</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* Product Cards */}
            {Array.from({ length: 9 }).map((_, i) => (
              <Link
                key={i}
                to="/products/$slug"
                params={{ slug: `product-${i + 1}` }}
                className="bg-card group rounded-lg border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <div className="bg-muted h-full w-full transition-transform group-hover:scale-105" />
                  {i % 3 === 0 && (
                    <span className="bg-destructive absolute top-2 left-2 rounded px-2 py-1 text-xs font-medium text-white">
                      -20%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Producto de ejemplo {i + 1}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    Descripción breve del producto
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      ${((i + 1) * 15000).toLocaleString("es-AR")}
                    </span>
                    {i % 3 === 0 && (
                      <span className="text-muted-foreground text-sm line-through">
                        ${((i + 1) * 18750).toLocaleString("es-AR")}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    12 cuotas de $
                    {(((i + 1) * 15000) / 12).toLocaleString("es-AR", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <button className="border-input rounded-md border px-3 py-2 text-sm">
              ← Anterior
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`rounded-md border px-3 py-2 text-sm ${
                  page === 1 ? "bg-primary text-primary-foreground" : "border-input"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="border-input rounded-md border px-3 py-2 text-sm">
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
