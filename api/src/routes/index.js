const jRouter = require('koa-joi-router');
// const Joi = jRouter.Joi;

const router = jRouter();

router.route({
  method: 'get',
  path: '/token',
  validate: {
  },
  handler: async (ctx) => {
    ctx.response.json = ctx.state.tokendata;
  },
});

module.exports = router;
