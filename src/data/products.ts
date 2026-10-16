import data from './products.json';

export interface Finish {
  id: string;
  name: string;
  img: string;
  hex: string;
  // extra views of this finish, shown as thumbnails under the main image
  gallery?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  finishes: Finish[];
}

export interface Category {
  id: string;
  name: string;
  image: string | null;
}

// products.json is the single source for categories, products and their photos
export const CATEGORIES: Category[] = data.categories;
export const PRODUCTS: Product[] = data.products;

export interface CatalogItem {
  productId: string;
  productName: string;
  finishIndex: number;
  finish: Finish;
}

export function flattenCatalog(): CatalogItem[] {
  return PRODUCTS.flatMap((product) =>
    product.finishes.map((finish, finishIndex) => ({
      productId: product.id,
      productName: product.name,
      finishIndex,
      finish,
    }))
  );
}

export function getProduct(productId: string | undefined): Product {
  return PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
}

export function getCategory(categoryId: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.id === categoryId);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categoryId);
}

// The original spoon-rest PNG heroes are 2x2 collages; cards crop them to one quadrant
export function isCollage(src: string): boolean {
  return src.endsWith('.png');
}

export const FEATURED_INDICES = [0, 2, 3, 5, 8, 11];
