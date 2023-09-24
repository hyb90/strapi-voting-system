'use strict';

module.exports = {
    routes:[
        {
            method: "GET",
            path:"/services/get-votes-count-per-category/:id",
            handler:"custom-controller.getVotesCountPerServiceForCategory",
            config:{
                polisies:[]
            }
        },
        {
            method: "GET",
            path:"/votes/get-total-count",
            handler:"custom-controller.getTotalVotesCount",
            config:{
                polisies:[]
            }
        },
        {
            method: "GET",
            path:"/votes/get-statistics-per-category/:id",
            handler:"custom-controller.getStatisticForCategory",
            config:{
                polisies:[]
            }
        }
    ]
}