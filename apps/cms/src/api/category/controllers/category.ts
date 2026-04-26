import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

const populate = {
  heroImage: true,
  products: {
    populate: {
      images: true,
      brand: true,
    },
  },
  pageSections: {
    on: {
      'sections.hero': { populate: '*' },
      'sections.featured-categories': {
        populate: {
          cards: {
            populate: {
              category: { populate: { heroImage: true } },
            },
          },
        },
      },
    },
  },
} as const;

export default factories.createCoreController('api::category.category', () => ({
  async find(ctx: Context) {
    ctx.query = { ...ctx.query, populate };
    return await super.find(ctx);
  },
  async findOne(ctx: Context) {
    ctx.query = { ...ctx.query, populate };
    return await super.findOne(ctx);
  },
}));
