const pool = require('../db/db');

const Restaurant = {
  async create({ name, description, address, ownerid, subscriptionplan }) {
    const query = `
      INSERT INTO restaurants (name, description, address, ownerid, subscriptionplan)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, address, ownerid, subscriptionplan, created_at;
    `;
    const values = [name, description, address, ownerid, subscriptionplan];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM restaurants WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM restaurants';
    const result = await pool.query(query);
    return result.rows;
  },

  // Ban restaurant (without affecting approvalstatus in users)
  async banRestaurant(id) {
    const query = 'UPDATE restaurants SET approvalstatus = $1 WHERE id = $2 RETURNING *';
    const values = ['banned', id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByOwner(owner_id) {
    const query = 'SELECT * FROM restaurants WHERE ownerid = $1';
    const result = await pool.query(query, [owner_id]);
    return result.rows[0];
  }
};

module.exports = Restaurant;
