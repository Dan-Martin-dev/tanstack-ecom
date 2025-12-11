import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "~/lib/db";
import { category, product, productImage } from "~/lib/db/schema";

// ============================================================================
// TYPES
// ============================================================================

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  weight: number | null;
  categoryId: string | null;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface PaginatedProducts {
  products: ProductWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  children: CategoryWithChildren[];
}

// ============================================================================
// HELPER: Map product row to typed response
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductToResponse(p: any): ProductWithRelations {
  const cat = p.category && !Array.isArray(p.category) ? p.category : null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    sku: p.sku,
    weight: p.weight,
    categoryId: p.categoryId,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    images: (p.images || []).map(
      (img: { id: string; url: string; alt: string | null; sortOrder: number }) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
      }),
    ),
    category: cat
      ? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        }
      : null,
  };
}

// ============================================================================
// INTERNAL QUERY FUNCTIONS
// ============================================================================

async function queryProducts(filters: ProductFilters): Promise<PaginatedProducts> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [eq(product.isActive, true)];

  if (filters.categorySlug) {
    const cat = await db.query.category.findFirst({
      where: eq(category.slug, filters.categorySlug),
    });
    if (cat) {
      conditions.push(eq(product.categoryId, cat.id));
    }
  }

  if (filters.search) {
    conditions.push(
      or(
        ilike(product.name, `%${filters.search}%`),
        ilike(product.description, `%${filters.search}%`),
      )!,
    );
  }

  if (filters.minPrice !== undefined) {
    conditions.push(gte(product.price, filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(lte(product.price, filters.maxPrice));
  }

  if (filters.inStock) {
    conditions.push(gte(product.stock, 1));
  }

  if (filters.featured) {
    conditions.push(eq(product.isFeatured, true));
  }

  // Determine sort order
  let orderBy;
  switch (filters.sortBy) {
    case "price_asc":
      orderBy = asc(product.price);
      break;
    case "price_desc":
      orderBy = desc(product.price);
      break;
    case "newest":
      orderBy = desc(product.createdAt);
      break;
    case "name_asc":
      orderBy = asc(product.name);
      break;
    case "name_desc":
      orderBy = desc(product.name);
      break;
    default:
      orderBy = desc(product.createdAt);
  }

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(product)
    .where(and(...conditions));
  const total = countResult[0]?.count ?? 0;

  // Get products with relations
  const products = await db.query.product.findMany({
    where: and(...conditions),
    orderBy: [orderBy],
    limit,
    offset,
    with: {
      images: {
        orderBy: [asc(productImage.sortOrder)],
      },
      category: true,
    },
  });

  return {
    products: products.map(mapProductToResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function queryProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const p = await db.query.product.findFirst({
    where: and(eq(product.slug, slug), eq(product.isActive, true)),
    with: {
      images: {
        orderBy: [asc(productImage.sortOrder)],
      },
      category: true,
    },
  });

  if (!p) return null;
  return mapProductToResponse(p);
}

async function queryFeaturedProductsWithLimit(
  limit: number,
): Promise<ProductWithRelations[]> {
  const products = await db.query.product.findMany({
    where: and(eq(product.isActive, true), eq(product.isFeatured, true)),
    orderBy: [desc(product.createdAt)],
    limit,
    with: {
      images: {
        orderBy: [asc(productImage.sortOrder)],
      },
      category: true,
    },
  });

  return products.map(mapProductToResponse);
}

async function queryCategoryTree(): Promise<CategoryWithChildren[]> {
  const categories = await db.query.category.findMany({
    where: eq(category.isActive, true),
    orderBy: [asc(category.sortOrder), asc(category.name)],
  });

  // Build tree structure
  const categoryMap = new Map<string, CategoryWithChildren>();
  const roots: CategoryWithChildren[] = [];

  // First pass: create all nodes
  for (const cat of categories) {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parentId: cat.parentId,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      children: [],
    });
  }

  // Second pass: build tree
  for (const cat of categories) {
    const node = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      categoryMap.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

async function queryCategoryBySlug(
  slug: string,
): Promise<{ category: CategoryWithChildren; products: PaginatedProducts } | null> {
  const cat = await db.query.category.findFirst({
    where: and(eq(category.slug, slug), eq(category.isActive, true)),
  });

  if (!cat) return null;

  // Get subcategories
  const subcategories = await db.query.category.findMany({
    where: and(eq(category.parentId, cat.id), eq(category.isActive, true)),
    orderBy: [asc(category.sortOrder), asc(category.name)],
  });

  const categoryWithChildren: CategoryWithChildren = {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image: cat.image,
    parentId: cat.parentId,
    isActive: cat.isActive,
    sortOrder: cat.sortOrder,
    children: subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      image: sub.image,
      parentId: sub.parentId,
      isActive: sub.isActive,
      sortOrder: sub.sortOrder,
      children: [],
    })),
  };

  // Get products in this category
  const productsResult = await queryProducts({ categorySlug: slug, limit: 12, page: 1 });

  return {
    category: categoryWithChildren,
    products: productsResult,
  };
}

// ============================================================================
// SERVER FUNCTIONS - exposed to routes
// ============================================================================

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  return queryProducts({});
});

export const getProductBySlug = createServerFn({ method: "GET" }).handler(async () => {
  // Note: For parameterized server functions, we need to use queryOptions pattern
  // or pass params through search. For now, this returns null and routes handle it.
  return null as ProductWithRelations | null;
});

export const getFeaturedProducts = createServerFn({ method: "GET" }).handler(async () => {
  return queryFeaturedProductsWithLimit(8);
});

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  return queryCategoryTree();
});

export const getCategoryBySlug = createServerFn({ method: "GET" }).handler(async () => {
  return null as { category: CategoryWithChildren; products: PaginatedProducts } | null;
});

// ============================================================================
// DIRECT QUERY FUNCTIONS - for use in route loaders
// ============================================================================

export {
  queryCategoryBySlug,
  queryFeaturedProductsWithLimit,
  queryProductBySlug,
  queryProducts,
};
