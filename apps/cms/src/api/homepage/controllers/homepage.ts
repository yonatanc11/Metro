import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

const linkPopulate = {
  category: { fields: ['name', 'slug'] },
} as const;

export default factories.createCoreController('api::homepage.homepage', () => ({
  async find(ctx: Context) {
    ctx.query = {
      ...ctx.query,
      populate: {
        sections: {
          on: {
            'sections.hero': {
              populate: {
                backgroundImage: true,
                cta: { populate: linkPopulate },
                secondaryCta: { populate: linkPopulate },
              },
            },
            'sections.featured-categories': {
              populate: {
                viewAll: { populate: linkPopulate },
                cards: {
                  populate: {
                    category: { populate: { heroImage: true } },
                  },
                },
              },
            },
          },
        },
        seo: { populate: '*' },
      },
    };
    return await super.find(ctx);
  },
}));
