import { queryOptions } from "@tanstack/react-query";

// Types based on schema
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  categoryId: number | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  images: ProductImage[];
  category: Category | null;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// API functions (to be connected to real endpoints)
async function fetchProducts(filters: ProductFilters): Promise<PaginatedProducts> {
  const params = new URLSearchParams();

  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.limit) params.set("limit", filters.limit.toString());

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

async function fetchProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`/api/products/${slug}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }
  return response.json();
}

async function fetchFeaturedProducts(): Promise<Product[]> {
  const response = await fetch("/api/products?featured=true&limit=8");
  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }
  const data = await response.json();
  return data.products;
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(`/api/categories/${slug}`);
  if (!response.ok) {
    throw new Error("Category not found");
  }
  return response.json();
}

// Query Options
export const productsQueryOptions = (filters: ProductFilters = {}) =>
  queryOptions({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

export const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const featuredProductsQueryOptions = () =>
  queryOptions({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

export const categoryQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["category", slug],
    queryFn: () => fetchCategoryBySlug(slug),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
