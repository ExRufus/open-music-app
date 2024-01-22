const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator
  
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const song_Id = await this._service.addSong({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      message: 'Song added successfully',
      data: { songId: song_Id },
    }).code(201);
    return response;
  }

  async getSongsHandler(request, h) {
      const { title, performer } = request.query;
      const songs = await this._service.getSongs(title, performer);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
  }

  async getSongByIdHandler(request, h) {
    const { id = songId } = request.params;

    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'Music data updated successfully'
    }
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Successfully delete Music'
    }
  }
}

module.exports = SongsHandler;