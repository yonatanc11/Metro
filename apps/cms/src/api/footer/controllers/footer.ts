import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::footer.footer', () => ({
  async find(ctx: Context) {
    ctx.query = {
      ...ctx.query,
      populate: {
        links: {
          populate: {
            category: { fields: ['name', 'slug'] },
          },
        },
      },
    };
    return await super.find(ctx);
  },
}));
