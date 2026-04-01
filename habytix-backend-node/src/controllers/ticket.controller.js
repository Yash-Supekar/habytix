const Ticket = require("../models/ticket.model");

// ================= TENANT =================
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTicketsByTenant = async (req, res) => {
  try {
    const tickets = await Ticket.findByTenantId(req.params.tenantId);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= COMMON =================
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= MANAGER =================
exports.getAllTickets = async (req, res) => {
  const tickets = await Ticket.findAll();
  res.json(tickets);
};

exports.updateStatus = async (req, res) => {
  const ticket = await Ticket.updateStatus(req.params.id, req.query.status);
  res.json(ticket);
};

exports.assignTicket = async (req, res) => {
  const ticket = await Ticket.assign(req.params.id, req.query.staffId);
  res.json(ticket);
};

exports.closeTicket = async (req, res) => {
  const ticket = await Ticket.close(req.params.id);
  res.json(ticket);
};

// ================= STAFF =================
exports.getTicketsForStaff = async (req, res) => {
  const tickets = await Ticket.findByAssignedTo(req.params.staffId);
  res.json(tickets);
};

exports.staffUpdateStatus = async (req, res) => {
  const ticket = await Ticket.updateStatus(req.params.id, req.query.status);
  res.json(ticket);
};

exports.getStaffStats = async (req, res) => {
  const stats = await Ticket.getStaffStats(req.params.staffId);
  res.json(stats);
};
