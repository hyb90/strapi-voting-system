module.exports = {
  generalResponse(code, message, data = null, action = '',) {
    if (!code || '')
      code = _constant.SUCCESS_CODE;
    return {
      code: code,
      message: message,
      action: action,
      data: data
    };
  },

  saveErrorLog(error, request_info){
    console.log(request_info.bodyParams);
    strapi.services[_constant.error_log_service].create({
      name: error.name ? error.name : null,
      message: error.message ? error.message : null,
      request_url: request_info.url ? request_info.url : null,
      request_method: request_info.methodType ? request_info.methodType : null,
      request_body: request_info.bodyParams ? request_info.bodyParams : null,
      request_params: request_info.queryParams ? request_info.queryParams : null,
      stack: error.stack ? error.stack.toString() : null
    });
  }
}
