const pool = require('../db/db');

const Restaurant = {
  async create({ name, description, address, latitude, longitude, ownerid, subscriptionplan, ownerApprovalStatus }) {
    const status = ownerApprovalStatus === 'approved' ? 'approved' : 'pending'; // Dynamic status
    const query = `
      INSERT INTO restaurants (name, description, address, latitude, longitude, ownerid, subscriptionplan, status, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, name, description, address, latitude, longitude, ownerid, subscriptionplan, status, created_at, updated_at;
    `;
    const values = [name, description, address, latitude, longitude, ownerid, subscriptionplan || 'Basic', status];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateSubscriptionPlan(restaurantId, newPlan) {
    const query = `
      UPDATE restaurants
      SET subscriptionplan = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [newPlan, restaurantId]);
    return result.rows[0];
  },
  
  async getRestaurantById(id, ownerid) {
    const query = `
      SELECT id, name, description, address, latitude, longitude, ownerid, subscriptionplan, status, created_at, updated_at 
      FROM restaurants 
      WHERE id = $1 AND ownerid = $2
    `;
    const result = await pool.query(query, [id, ownerid]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM restaurants';
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM restaurants WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByOwner(owner_id) {
    const query = 'SELECT * FROM restaurants WHERE ownerid = $1';
    const result = await pool.query(query, [owner_id]);
    return result.rows[0];
  },

  async findByIdAndOwner(restaurantId, ownerId) {
    const query = 'SELECT * FROM restaurants WHERE id = $1 AND ownerid = $2';
    const result = await pool.query(query, [restaurantId, ownerId]);
    return result.rows[0];
  },
  
  async updateRestaurant(id, ownerid, { name, description, address, latitude, longitude, subscriptionplan }) {
    const query = `
      UPDATE restaurants 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          address = COALESCE($3, address),
          latitude = COALESCE($4, latitude),
          longitude = COALESCE($5, longitude),
          subscriptionplan = COALESCE($6, subscriptionplan),
          updated_at = NOW()
      WHERE id = $7 AND ownerid = $8
      RETURNING *;
    `;
    const values = [name, description, address, latitude, longitude, subscriptionplan, id, ownerid];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deactivateRestaurant(id, ownerid) {
    const query = `
      UPDATE restaurants 
      SET approvalstatus = 'inactive', updated_at = NOW()
      WHERE id = $1 AND ownerid = $2 AND approvalstatus = 'active'
      RETURNING *;
    `;
    const result = await pool.query(query, [id, ownerid]);
    return result.rows[0];
  }
};

module.exports = Restaurant;
