'use strict';

/**
 * `generalResponse` middleware
 */
const _functionsHelper=require("../helpers/functionHelper")
module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    await next();
    // if ((ctx.response.status === 200 && ctx.response.body.response) || (ctx.response.status === 400 && ctx.response.body.body.response)) {
      strapi.log.info('In generalResponse condition.');
      let data = ctx.response.body;
      let responseCodes = '1';
      if (ctx.response.body.code){
        responseCodes = ctx.response.body.code;
      }
      return ctx.send(_functionsHelper.generalResponse(responseCodes, '', data, null))
    // }
  };
};
