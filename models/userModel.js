const pool = require('../db/db');
console.log('Is pool connected:', !!pool);
const bcrypt = require('bcrypt')

const User = {
  async create({ name, email, password, role, approvalstatus }) {
    const plainPassword = password;
    const query = `
      INSERT INTO users (name, email, password, role, approvalstatus)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, approvalstatus, created_at;
    `;
    const values = [name, email, plainPassword, role, approvalstatus];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // async findByEmail(email) {
  //   const query = 'SELECT * FROM users WHERE email = $1';
  //   const result = await pool.query(query, [email]);
  //   return result.rows[0];
  // },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const result = await pool.query(query, [email]);
    console.log('Query result:', result.rows);
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Approve or change approval status to any status
  async updateApprovalStatus(id, status) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

  // Ban a restaurant owner
  async banRestaurantOwner(id) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 AND role = $3 RETURNING *';
    const values = ['banned', id, 'restaurant_owner'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async unbanRestaurantOwner(id) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 AND role = $3 RETURNING *';
    const values = ['approved', id, 'restaurant_owner'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  async rejectRestaurantOwner(id) {
    const query = 'UPDATE users SET approvalstatus = $1 WHERE id = $2 AND role = $3 RETURNING *';
    const values = ['rejected', id, 'restaurant_owner'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getPendingRestaurantOwners() {
    const query = 'SELECT * FROM users WHERE role = $1 AND approvalstatus = $2';
    const values = ['restaurant_owner', 'pending'];
    const result = await pool.query(query, values);
    return result.rows;
  },

  // Get All Approved Restaurant Owners
  async getApprovedRestaurantOwners() {
    const query = 'SELECT * FROM users WHERE role = $1 AND approvalstatus = $2';
    const values = ['restaurant_owner', 'approved'];
    const result = await pool.query(query, values);
    return result.rows;
  },

  // Get All Rejected Restaurant Owners
  async getRejectedRestaurantOwners() {
    const query = 'SELECT * FROM users WHERE role = $1 AND approvalstatus = $2';
    const values = ['restaurant_owner', 'rejected'];
    const result = await pool.query(query, values);
    return result.rows;
  }
};

module.exports = User;
