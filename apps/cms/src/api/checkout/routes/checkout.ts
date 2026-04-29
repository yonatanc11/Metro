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
  ],
};
