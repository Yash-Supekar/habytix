const pool = require("../config/db"); 


class Ticket {
  static async create(data) {
    const { title, description, tenantId, priority = "MEDIUM" } = data;

    const result = await pool.query(
      `INSERT INTO tickets (title, description, tenant_id, priority, status)
       VALUES ($1,$2,$3,$4,'OPEN')
       RETURNING *`,
      [title, description, tenantId, priority]
    );

    return result.rows[0];
  }

  static async findByTenantId(tenantId) {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenantId]
    );
    return result.rows;
  }

  static async findAll() {
    const result = await pool.query(
      "SELECT * FROM tickets ORDER BY created_at DESC"
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      "UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    return result.rows[0];
  }

  static async assign(id, staffId) {
    const result = await pool.query(
      "UPDATE tickets SET assigned_to=$1, status='IN_PROGRESS' WHERE id=$2 RETURNING *",
      [staffId, id]
    );
    return result.rows[0];
  }

  static async close(id) {
    const result = await pool.query(
      "UPDATE tickets SET status='CLOSED' WHERE id=$1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async findByAssignedTo(staffId) {
    const result = await pool.query(
      "SELECT * FROM tickets WHERE assigned_to=$1",
      [staffId]
    );
    return result.rows;
  }

  static async getStaffStats(staffId) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status != 'CLOSED') as active,
         COUNT(*) FILTER (WHERE status = 'CLOSED') as closed
       FROM tickets
       WHERE assigned_to = $1`,
      [staffId]
    );

    return result.rows[0];
  }
}

module.exports = Ticket;
