export const routes = {
  home: '/',
  cart: '/cart',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/success',
} as const;

export function productHref(categorySlug: string, productSlug: string): string {
  return `/${categorySlug}/${productSlug}`;
}

export function categoryHref(categorySlug: string): string {
  return `/${categorySlug}`;
}
