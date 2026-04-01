const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");

// ================= TENANT =================
router.post("/", ticketController.createTicket);
router.get("/tenant/:tenantId", ticketController.getTicketsByTenant);

// ================= MANAGER =================
router.get("/", ticketController.getAllTickets);
router.put("/:id/status", ticketController.updateStatus);
router.put("/:id/assign", ticketController.assignTicket);
router.put("/:id/close", ticketController.closeTicket);

// ================= STAFF =================
router.get("/staff/:staffId", ticketController.getTicketsForStaff);
router.put("/:id/staff/status", ticketController.staffUpdateStatus);
router.get("/staff/:staffId/stats", ticketController.getStaffStats);

// ================= COMMON =================
router.get("/:id", ticketController.getTicketById);

module.exports = router;