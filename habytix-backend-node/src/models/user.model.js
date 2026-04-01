const pool = require("../config/db");

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  static async existsByEmail(email) {
    const result = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email]
    );
    return result.rowCount > 0;
  }

  static async create({ fullName, email, password, role }) {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, full_name, email, role`,
      [fullName, email, password, role]
    );

    return result.rows[0];
  }

  static async findByRole(role) {
    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE role = $1",
      [role]
    );
    return result.rows;
  }

  static async update(id, { fullName, email, password }) {
    const result = await pool.query(
      `UPDATE users
       SET full_name=$1, email=$2,
           password = COALESCE($3, password)
       WHERE id=$4
       RETURNING id, full_name, email, role`,
      [fullName, email, password, id]
    );

    return result.rows[0];
  }
  static async findById(id) {
    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = User;
