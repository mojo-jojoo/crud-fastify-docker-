import pool from '../config/db.js';

class UserModel {
  // Get all users
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT id, name, email, age, created_at FROM users ORDER BY id ASC'
    );
    return rows;
  }

  // Get single user by ID
  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  // Create new user
  static async create(userData) {
    const { name, email, age } = userData;
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, age) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, age, created_at`,
      [name, email, age]
    );
    return rows[0];
  }

  // Update user
  static async update(id, userData) {
    const { name, email, age } = userData;
    const { rows } = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, age = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, name, email, age, created_at, updated_at`,
      [name, email, age, id]
    );
    return rows[0];
  }

  // Delete user
  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );
    return rows[0];
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    let queryText = 'SELECT id FROM users WHERE email = $1';
    const params = [email];
    
    if (excludeId) {
      queryText += ' AND id != $2';
      params.push(excludeId);
    }
    
    const { rows } = await pool.query(queryText, params);
    return rows.length > 0;
  }
}

export default UserModel;