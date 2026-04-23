import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::navigation.navigation', () => ({
  async find(ctx: Context) {
    ctx.query = {
      ...ctx.query,
      populate: {
        items: {
          on: {
            'navigation.link': {
              populate: {
                category: { fields: ['name', 'slug'] },
              },
            },
          },
        },
      },
    };
    return await super.find(ctx);
  },
}));
