import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::homepage.homepage', () => ({
  async find(ctx: Context) {
    ctx.query = {
      ...ctx.query,
      populate: {
        sections: {
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
        seo: { populate: '*' },
      },
    };
    return await super.find(ctx);
  },
}));
