import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

const populate = {
  images: true,
  brand: { fields: ['name', 'slug'] },
  category: { fields: ['name', 'slug'] },
  specs: true,
  pageSections: {
    on: {
      'sections.rich-content': {
        populate: '*',
      },
    },
  },
} as const;

export default factories.createCoreController('api::product.product', () => ({
  async find(ctx: Context) {
    ctx.query = { ...ctx.query, populate };
    return await super.find(ctx);
  },
  async findOne(ctx: Context) {
    ctx.query = { ...ctx.query, populate };
    return await super.findOne(ctx);
  },
}));
