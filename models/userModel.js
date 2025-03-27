const pool = require('../db/db');
const bcrypt = require('bcrypt');

const User = {
  async create({ name, email, password, role, approvalstatus }) {
    const plainPassword = password;  // For now, using plain password, modify this when hashing is implemented.
    
    const query = `
      INSERT INTO users (name, email, password, role, approvalstatus)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, approvalstatus, created_at;
    `;
    const values = [name, email, plainPassword, role, approvalstatus];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Approve user for restaurant ownership
  async approveUser(id) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 RETURNING *';
    const values = ['approved', id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async rejectUser(id) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 RETURNING *';
    const values = ['rejected', id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = User;
