const pool = require('../db/db');
const bcrypt = require('bcrypt');

const User = {
  async create({ name, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
    const values = [name, email, hashedPassword, role];
    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    // If the role is 'restaurant', create a corresponding restaurant record
    if (role === 'restaurant') {
      const restaurantQuery = `
        INSERT INTO restaurants (owner_id, status)
        VALUES ($1, 'pending')
        RETURNING id, status;
      `;
      await pool.query(restaurantQuery, [newUser.id]);
    }

    return newUser;
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },
};



module.exports = User;
