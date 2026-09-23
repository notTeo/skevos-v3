export interface Finish {
  id: string;
  name: string;
  img: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  finishes: Finish[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'spoon-rest',
    name: 'Spoon Rest',
    category: 'Kitchen',
    description:
      'Solid natural marble, hand-finished with a gently sloped basin. Veining, tone and translucency vary by slab — the piece you receive is one of a kind.',
    finishes: [
      { id: 'travertino-classic', name: 'Travertino Classic', img: '/assets/spoon-travertino-classic.png', hex: '#CBB394' },
      { id: 'travertino-choco', name: 'Travertino Choco', img: '/assets/spoon-travertino-choco.png', hex: '#5A3D2E' },
      { id: 'green', name: 'Green', img: '/assets/spoon-green.png', hex: '#3F6E58' },
      { id: 'red', name: 'Red', img: '/assets/spoon-red.png', hex: '#7A3B34' },
      { id: 'perla', name: 'Perla', img: '/assets/spoon-perla.png', hex: '#D9D3C8' },
      { id: 'nero-greco', name: 'Nero Greco', img: '/assets/spoon-nero-greco.png', hex: '#2B2B2B' },
      { id: 'salomi', name: 'Salomi', img: '/assets/spoon-salomi.png', hex: '#C9A876' },
      { id: 'semi-white', name: 'Semi White', img: '/assets/spoon-semi-white.png', hex: '#E8E2D4' },
      { id: 'rodiths', name: 'Rodiths', img: '/assets/spoon-rodiths.png', hex: '#C98D7C' },
      { id: 'maroko-sand', name: 'Maroko Sand', img: '/assets/spoon-maroko-sand.png', hex: '#C7A577' },
      { id: 'maroko-stoned', name: 'Maroko Stoned', img: '/assets/spoon-maroko-stoned.png', hex: '#8B8478' },
      { id: 'delino', name: 'Delino', img: '/assets/spoon-delino.png', hex: '#CFC9BD' },
      { id: 'foume', name: 'Foume', img: '/assets/spoon-foume.png', hex: '#6E6A63' },
      { id: 'white', name: 'White', img: '/assets/spoon-white.png', hex: '#F2EFE9' },
    ],
  },
];

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

export const FEATURED_INDICES = [0, 2, 3, 5, 8, 11];
