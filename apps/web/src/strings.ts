export const strings = {
  brand: {
    wordmark: 'METRO',
    name: 'Metro',
    tagline: 'Metro — motorcycle accessories',
  },
  meta: {
    cartTitle: 'Cart — Metro',
  },
  category: {
    results: {
      singular: 'result',
      plural: 'results',
    },
    empty: {
      filtered: 'No products match your filters.',
      unfiltered: 'No products in this category yet.',
    },
  },
  product: {
    fallbackCta: 'Add to Loadout',
  },
  header: {
    search: 'Search',
    account: 'Account',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    cart: 'Cart',
    cartEmpty: 'empty',
  },
  filters: {
    price: {
      title: 'Price',
      minLabel: 'Minimum price',
      maxLabel: 'Maximum price',
    },
    brand: {
      title: 'Brand',
      empty: 'No brands available.',
    },
  },
  cart: {
    title: 'Your Cart',
    itemSingular: 'Item',
    itemPlural: 'Items',
    empty: {
      title: 'Your cart is empty',
      subtitle: 'Browse the catalog to start your loadout.',
      cta: 'Continue shopping',
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      calculatedNext: 'Calculated next',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      secureNote: 'Secure Encrypted Checkout',
    },
    mobileBar: {
      total: 'Total',
      checkout: 'Checkout',
    },
    line: {
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
      remove: 'Remove item',
      removeLabel: 'Remove',
    },
  },
  productHero: {
    viewImage: 'View image',
    toastAlreadyAdded: 'Item already added',
    toastAdded: 'Added to loadout',
  },
  toast: {
    region: 'Notifications',
  },
  notFound: {
    message: 'This page could not be found.',
  },
  error: {
    title: 'Something went wrong',
    retry: 'Try again',
  },
  checkout: {
    metaTitle: 'Checkout — Metro',
    backToShop: 'Back to Shop',
    pageTitle: 'Secure Checkout',
    initializing: 'Initializing payment…',
    errorEmptyCart: 'Your cart is empty.',
    errorGeneric: "We couldn't start checkout. Try again.",
    success: {
      metaTitle: 'Order Confirmed — Metro',
      titlePaid: 'Order Confirmed',
      titlePending: 'Processing Payment',
      titleFailed: 'Payment Failed',
      titleCancelled: 'Order Cancelled',
      orderLabel: 'Order',
      confirmationSentTo: 'We sent confirmation to',
      processingNote:
        "We're confirming your payment with the bank. This usually takes a few seconds.",
      shippingTo: 'Shipping To',
      summaryTitle: 'Your Order',
      total: 'Total',
      continueShopping: 'Continue Shopping',
      missingSession: "We couldn't find that order.",
    },
  },
} as const;
