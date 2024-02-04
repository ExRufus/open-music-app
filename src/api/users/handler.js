const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const user_id = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      data: { userId: user_id },
    }).code(201);
    return response;
  }
}

module.exports = UsersHandler;