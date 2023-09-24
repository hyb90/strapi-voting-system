'use strict';

/**
 * vote controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vote.vote', ({ strapi }) =>  ({
    async create(ctx) {
      for(const val of ctx.request.body.data.rates){
        let entries =await strapi.query('api::vote.vote').findOne({
          where: { user: ctx.request.body.data.user,service:val.service },
        })
        console.log(val);
        if (entries==null){
          await strapi.service('api::vote.vote').create({data:{
          user:ctx.request.body.data.user,
          service: val.service,
          rating: val.rating,
          note: val.note,
      }});}
      else{await strapi.service('api::vote.vote').update(entries.id,{data:{
          user:ctx.request.body.data.user,
          service: val.service,
          rating: val.rating,
          note: val.note,
      }});}
      }
      return {data:"success"}
    }
  }));
