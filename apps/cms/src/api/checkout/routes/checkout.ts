export default {
  routes: [
    {
      method: 'POST',
      path: '/checkout/start',
      handler: 'checkout.start',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/checkout/webhook',
      handler: 'checkout.webhook',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/checkout/order/:documentId',
      handler: 'checkout.getOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/checkout/order-by-session/:sessionId',
      handler: 'checkout.getOrderBySession',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
