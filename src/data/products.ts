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

// Stone photos for the swatch circles; finishes without a photo fall back to their hex
const FINISH_PHOTOS = new Set([
  'travertino-classic', 'travertino-choco', 'green', 'red', 'perla', 'nero-greco', 'salomi',
  'semi-white', 'rodiths', 'maroko-sand', 'maroko-stoned', 'delino', 'foume', 'white',
  'cool-grey', 'blue-gray', 'dark-grey',
]);

export function swatchBackground(finish: Finish): string {
  return FINISH_PHOTOS.has(finish.id)
    ? `${finish.hex} url(/assets/finishes/${finish.id}.jpg) center / cover`
    : finish.hex;
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

// home page picks: one piece per product so the row shows the range, [productId, finish]
const FEATURED: [string, string][] = [
  ['tray-handles', 'perla'], ['candlestick-tapered', 'green'], ['bowl-small', 'travertino-choco'],
  ['platter-oval', 'nero-greco'], ['candlestick-block', 'red'], ['board-round', 'travertino-classic'],
];

export function getFeaturedItems(): CatalogItem[] {
  const catalog = flattenCatalog();
  return FEATURED.flatMap(([productId, finishId]) =>
    catalog.filter((item) => item.productId === productId && item.finish.id === finishId)
  );
}

// every material in the catalog, once each, in first-seen order
export const MATERIALS: Finish[] = [
  ...new Map(PRODUCTS.flatMap((p) => p.finishes).map((f) => [f.id, f])).values(),
];

// colour families used to group the materials page
export const TONES = ['light', 'warm', 'grey', 'bold'] as const;
export type Tone = (typeof TONES)[number];

const MATERIAL_TONES: Record<string, Tone> = {
  white: 'light', 'semi-white': 'light', perla: 'light', delino: 'light',
  'travertino-classic': 'warm', salomi: 'warm', 'maroko-sand': 'warm', rodiths: 'warm',
  'cool-grey': 'warm', 'blue-gray': 'warm',
  'maroko-stoned': 'grey', foume: 'grey', 'dark-grey': 'grey', 'travertino-choco': 'grey',
  green: 'bold', red: 'bold', 'nero-greco': 'bold',
};

export function materialTone(finish: Finish): Tone {
  return MATERIAL_TONES[finish.id] ?? 'warm';
}

// categories that have at least one piece in this material
export function categoriesForMaterial(finishId: string): Category[] {
  return CATEGORIES.filter((c) =>
    getProductsByCategory(c.id).some((p) => p.finishes.some((f) => f.id === finishId))
  );
}
