/**
 * Database Seed Script
 *
 * Run with: bun run scripts/seed.ts
 *
 * Seeds the database with:
 * - Categories (Ropa, Calzado, Accesorios)
 * - Products (sample clothing/shoes for Argentine e-commerce)
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { category, product, productImage } from "../src/lib/db/schema/ecommerce.schema";

// Load env manually since we're outside the app
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment");
  process.exit(1);
}

const driver = postgres(DATABASE_URL);
const db = drizzle({ client: driver, casing: "snake_case" });

// ============================================================================
// SEED DATA
// ============================================================================

const CATEGORIES = [
  {
    name: "Ropa",
    slug: "ropa",
    description: "Ropa de moda para todas las ocasiones",
    sortOrder: 1,
  },
  {
    name: "Remeras",
    slug: "remeras",
    description: "Remeras de algodón premium",
    parentSlug: "ropa",
    sortOrder: 1,
  },
  {
    name: "Pantalones",
    slug: "pantalones",
    description: "Jeans, joggers y pantalones de vestir",
    parentSlug: "ropa",
    sortOrder: 2,
  },
  {
    name: "Buzos y Sweaters",
    slug: "buzos-sweaters",
    description: "Abrigos para el invierno",
    parentSlug: "ropa",
    sortOrder: 3,
  },
  {
    name: "Calzado",
    slug: "calzado",
    description: "Zapatillas, botas y zapatos",
    sortOrder: 2,
  },
  {
    name: "Zapatillas",
    slug: "zapatillas",
    description: "Zapatillas urbanas y deportivas",
    parentSlug: "calzado",
    sortOrder: 1,
  },
  {
    name: "Botas",
    slug: "botas",
    description: "Botas para todas las estaciones",
    parentSlug: "calzado",
    sortOrder: 2,
  },
  {
    name: "Accesorios",
    slug: "accesorios",
    description: "Gorras, cinturones y más",
    sortOrder: 3,
  },
] as const;

// Prices in centavos (ARS) - e.g., 2500000 = $25,000 ARS
const PRODUCTS = [
  // Remeras
  {
    name: "Remera Básica Blanca",
    slug: "remera-basica-blanca",
    description:
      "Remera de algodón 100% peinado. Corte regular, cuello redondo. Ideal para el día a día.",
    price: 1500000, // $15,000
    compareAtPrice: 1800000,
    stock: 50,
    sku: "REM-BAS-BLA-001",
    weight: 200,
    categorySlug: "remeras",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800",
    ],
  },
  {
    name: "Remera Oversize Negra",
    slug: "remera-oversize-negra",
    description:
      "Remera oversize de algodón premium. Perfecta para un look relajado y moderno.",
    price: 1800000, // $18,000
    stock: 35,
    sku: "REM-OVR-NEG-001",
    weight: 250,
    categorySlug: "remeras",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"],
  },
  {
    name: "Remera Estampada Urban",
    slug: "remera-estampada-urban",
    description: "Remera con estampado urbano exclusivo. Algodón suave, corte moderno.",
    price: 2200000, // $22,000
    compareAtPrice: 2800000,
    stock: 20,
    sku: "REM-EST-URB-001",
    weight: 220,
    categorySlug: "remeras",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"],
  },
  // Pantalones
  {
    name: "Jean Slim Fit Azul",
    slug: "jean-slim-fit-azul",
    description:
      "Jean slim fit de denim premium. Lavado medio, 5 bolsillos. El básico que no puede faltar.",
    price: 4500000, // $45,000
    compareAtPrice: 5500000,
    stock: 30,
    sku: "PAN-JEA-AZU-001",
    weight: 500,
    categorySlug: "pantalones",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800"],
  },
  {
    name: "Jogger Cargo Negro",
    slug: "jogger-cargo-negro",
    description:
      "Jogger cargo con bolsillos laterales. Tela liviana, elástico en cintura y puños.",
    price: 3800000, // $38,000
    stock: 25,
    sku: "PAN-JOG-NEG-001",
    weight: 400,
    categorySlug: "pantalones",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800"],
  },
  {
    name: "Pantalón Chino Beige",
    slug: "pantalon-chino-beige",
    description:
      "Pantalón chino de gabardina suave. Corte recto, ideal para ocasiones semi-formales.",
    price: 4200000, // $42,000
    stock: 15,
    sku: "PAN-CHI-BEI-001",
    weight: 450,
    categorySlug: "pantalones",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"],
  },
  // Buzos
  {
    name: "Buzo Hoodie Gris",
    slug: "buzo-hoodie-gris",
    description:
      "Buzo con capucha de algodón frisado. Interior suave, bolsillo canguro. El favorito del invierno.",
    price: 5500000, // $55,000
    compareAtPrice: 6500000,
    stock: 40,
    sku: "BUZ-HOO-GRI-001",
    weight: 600,
    categorySlug: "buzos-sweaters",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
  },
  {
    name: "Sweater Cuello Redondo Azul",
    slug: "sweater-cuello-redondo-azul",
    description:
      "Sweater de punto fino. Cuello redondo, ideal para usar solo o con camisa debajo.",
    price: 4800000, // $48,000
    stock: 20,
    sku: "BUZ-SWE-AZU-001",
    weight: 400,
    categorySlug: "buzos-sweaters",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"],
  },
  // Zapatillas
  {
    name: "Zapatillas Urban Street",
    slug: "zapatillas-urban-street",
    description:
      "Zapatillas urbanas de cuero sintético. Suela de goma, diseño minimalista. Comodidad todo el día.",
    price: 7500000, // $75,000
    compareAtPrice: 9000000,
    stock: 25,
    sku: "CAL-ZAP-URB-001",
    weight: 800,
    categorySlug: "zapatillas",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    ],
  },
  {
    name: "Zapatillas Running Pro",
    slug: "zapatillas-running-pro",
    description:
      "Zapatillas de running con tecnología de amortiguación. Malla transpirable, suela antideslizante.",
    price: 9500000, // $95,000
    stock: 15,
    sku: "CAL-ZAP-RUN-001",
    weight: 700,
    categorySlug: "zapatillas",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
  },
  {
    name: "Zapatillas Canvas Blancas",
    slug: "zapatillas-canvas-blancas",
    description:
      "Zapatillas de lona clásicas. Suela de goma vulcanizada, cordones de algodón. Un clásico atemporal.",
    price: 4500000, // $45,000
    stock: 40,
    sku: "CAL-ZAP-CAN-001",
    weight: 600,
    categorySlug: "zapatillas",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"],
  },
  // Botas
  {
    name: "Borcegos Cuero Negro",
    slug: "borcegos-cuero-negro",
    description:
      "Borcegos de cuero genuino. Suela track, interior forrado. Resistentes y con estilo.",
    price: 12000000, // $120,000
    compareAtPrice: 15000000,
    stock: 10,
    sku: "CAL-BOR-NEG-001",
    weight: 1200,
    categorySlug: "botas",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800"],
  },
  // Accesorios
  {
    name: "Gorra Dad Hat Negra",
    slug: "gorra-dad-hat-negra",
    description:
      "Gorra estilo dad hat de algodón. Ajuste con hebilla metálica. Simple y versátil.",
    price: 1200000, // $12,000
    stock: 60,
    sku: "ACC-GOR-NEG-001",
    weight: 100,
    categorySlug: "accesorios",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800"],
  },
  {
    name: "Cinturón Cuero Marrón",
    slug: "cinturon-cuero-marron",
    description: "Cinturón de cuero vacuno. Hebilla metálica clásica. Ancho 3.5cm.",
    price: 2500000, // $25,000
    stock: 30,
    sku: "ACC-CIN-MAR-001",
    weight: 150,
    categorySlug: "accesorios",
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
  },
  {
    name: "Mochila Urban Pack",
    slug: "mochila-urban-pack",
    description:
      'Mochila de poliéster resistente al agua. Compartimento para laptop 15", bolsillos organizadores.',
    price: 5500000, // $55,000
    compareAtPrice: 6800000,
    stock: 20,
    sku: "ACC-MOC-URB-001",
    weight: 800,
    categorySlug: "accesorios",
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
  },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedCategories() {
  console.log("📁 Seeding categories...");

  const categoryMap = new Map<string, string>(); // slug -> id

  // First pass: insert root categories
  for (const cat of CATEGORIES) {
    if (!("parentSlug" in cat)) {
      const [inserted] = await db
        .insert(category)
        .values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        })
        .returning({ id: category.id });

      categoryMap.set(cat.slug, inserted.id);
      console.log(`  ✓ ${cat.name}`);
    }
  }

  // Second pass: insert child categories
  for (const cat of CATEGORIES) {
    if ("parentSlug" in cat && cat.parentSlug) {
      const parentId = categoryMap.get(cat.parentSlug);
      if (!parentId) {
        console.error(`  ✗ Parent not found for ${cat.name}`);
        continue;
      }

      const [inserted] = await db
        .insert(category)
        .values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId,
          sortOrder: cat.sortOrder,
          isActive: true,
        })
        .returning({ id: category.id });

      categoryMap.set(cat.slug, inserted.id);
      console.log(`  ✓ ${cat.name} (child of ${cat.parentSlug})`);
    }
  }

  return categoryMap;
}

async function seedProducts(categoryMap: Map<string, string>) {
  console.log("\n📦 Seeding products...");

  for (const prod of PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.error(`  ✗ Category not found for ${prod.name}`);
      continue;
    }

    // Insert product
    const [inserted] = await db
      .insert(product)
      .values({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        stock: prod.stock,
        sku: prod.sku,
        weight: prod.weight,
        categoryId,
        isFeatured: prod.isFeatured,
        isActive: true,
      })
      .returning({ id: product.id });

    // Insert images
    if (prod.images && prod.images.length > 0) {
      await db.insert(productImage).values(
        prod.images.map((url, index) => ({
          productId: inserted.id,
          url,
          alt: prod.name,
          sortOrder: index,
        })),
      );
    }

    const featuredBadge = prod.isFeatured ? " ⭐" : "";
    console.log(
      `  ✓ ${prod.name} - $${(prod.price / 100).toLocaleString("es-AR")}${featuredBadge}`,
    );
  }
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await db.delete(productImage);
    await db.delete(product);
    await db.delete(category);
    console.log("  ✓ Cleared\n");

    // Seed data
    const categoryMap = await seedCategories();
    await seedProducts(categoryMap);

    console.log("\n✅ Seed completed successfully!");
    console.log(`   - ${CATEGORIES.length} categories`);
    console.log(`   - ${PRODUCTS.length} products`);
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await driver.end();
  }
}

main();
