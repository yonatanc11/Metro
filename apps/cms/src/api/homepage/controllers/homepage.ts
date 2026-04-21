import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::homepage.homepage', () => ({
  async find(ctx: Context) {
    ctx.query = {
      ...ctx.query,
      populate: {
        sections: { populate: '*' },
        seo: { populate: '*' },
      },
    };
    return await super.find(ctx);
  },
}));
