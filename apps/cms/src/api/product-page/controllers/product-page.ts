import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

const populate = {
  sections: {
    on: {
      'sections.rich-content': {
        populate: '*',
      },
    },
  },
} as const;

export default factories.createCoreController(
  'api::product-page.product-page',
  () => ({
    async find(ctx: Context) {
      ctx.query = { ...ctx.query, populate };
      return await super.find(ctx);
    },
  })
);
