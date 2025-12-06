import { Link } from "@tanstack/react-router";

export function ShopFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold">TanStack Shop</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu tienda online de confianza. Comprá los mejores productos con envío a todo
              el país.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold">Atención al cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contacto</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href="mailto:contacto@tanstackshop.com"
                  className="hover:text-foreground"
                >
                  contacto@tanstackshop.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <a href="tel:+5491112345678" className="hover:text-foreground">
                  +54 9 11 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                Buenos Aires, Argentina
              </li>
            </ul>

            {/* Social */}
            <div className="mt-4 flex gap-3">
              {["📘", "📸", "🐦"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-background hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 border-t pt-8">
          <p className="text-muted-foreground mb-3 text-center text-sm">Medios de pago</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "💳 Visa",
              "💳 Mastercard",
              "💳 Amex",
              "🏦 Transferencia",
              "💵 Efectivo",
            ].map((method) => (
              <span
                key={method}
                className="bg-background rounded border px-3 py-1 text-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} TanStack Shop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
