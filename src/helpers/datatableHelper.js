
const { sanitize } = require('@strapi/utils');
const {defaultSanitizeOutput} = require("@strapi/plugin-users-permissions/server/utils/sanitize/sanitizers");

module.exports = {
    dataTableRequest(data) {
        // const { filter, searchTerm, sorting } = data;
      console.log(data) ;
      return {
            Pagination: {
                _start: data.paginator ? (data.paginator.page - 1) * data.paginator.pageSize : 0,
                _limit: data.paginator ? data.paginator.pageSize : Number.MAX_SAFE_INTEGER,
            },
            filter: {
                ...(data.filter ? data.filter : {}),
                _sort: data.sorting ? `${data.sorting.column}:${data.sorting.direction}` : 'id:DESC',
                _q: data.searchTerm ? data.searchTerm : '',
            }
        };
    },
    dataTableResponse(data, total) {
        return {
            items: data,
            total: total
        };
    },
    async dataTable(data, model_name) {
      console.log(strapi.service(model_name)) ;
      const datatable = this.dataTableRequest(data)
        let entities = await strapi.service(model_name).find(datatable.filter);
        // entities = entities.map(entity => defaultSanitizeOutput(entity, { model: strapi.schema[model_name] }));
        // const total = entities.length;
        // entities = entities.slice(datatable.Pagination._start, datatable.Pagination._limit + datatable.Pagination._start);
         return this.dataTableResponse(entities, 1)
    }
}
