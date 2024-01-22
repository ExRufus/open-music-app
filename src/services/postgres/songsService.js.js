const { Pool } = require("pg");
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song failed to add');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration}) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, updatedAt, id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(`Failed to update music. id not found`);
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError(`Music failed to delete, Id ${id} not found`);
    }
  }
}

module.exports = SongsService;