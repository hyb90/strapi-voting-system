'use strict';

const vote = require('../../vote/controllers/vote');


const { createCoreController } = require('@strapi/strapi').factories;

module.exports =createCoreController('api::service.service', ({ strapi }) =>  ({
    async getVotesCountPerServiceForCategory(ctx) {
        let category =await strapi.query('api::category.category').findOne({
            where:{ id: ctx.params.id },
            populate: {services:{populate:{votes:{populate:['user']}}}}
            })
          let result=[];
          if(category==null) return {error:"category not found"};
          for(const service of category.services)
          {
            let excellent=[];
            let overwhelmed=[];
            let neutral=[];
            for(const vote of service.votes){
                if (vote.rating=="Excellent") excellent.push(vote);
                if (vote.rating=="Overwhelmed") overwhelmed.push(vote);
                if (vote.rating=="Neutral") neutral.push(vote);
            }
            result.push({name:service.name,name_en:service.name_en,icon:service.icon,excellent:excellent.length,overwhelmed:overwhelmed.length,neutral:neutral.length,votes:service.votes})
        }
        return result;
    },
    async getStatisticForCategory(ctx) {
        let category =await strapi.query('api::category.category').findOne({
            where:{ id: ctx.params.id },
            populate: {services:{populate:{votes:{populate:['user']}}}}
            })
          let result=[];
          if(category==null) return {error:"category not found"};
          for(const service of category.services)
          {
            for(const vote of service.votes){
                result.push(vote)
            }
        }
        return {count:result.length};
    },
    async getTotalVotesCount(ctx) {
        let votes =await strapi.query('api::vote.vote').findMany()
        let result=[];
        let excellent=[];
        let overwhelmed=[];
        let neutral=[];
        for(const vote of votes){
            if (vote.rating=="Excellent") excellent.push(vote);
            if (vote.rating=="Overwhelmed") overwhelmed.push(vote);
            if (vote.rating=="Neutral") neutral.push(vote);
        }
        result.push({excellent:excellent.length,overwhelmed:overwhelmed.length,neutral:neutral.length})
        return result;
    }
  }));
