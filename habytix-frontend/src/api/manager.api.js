import api from "./axios";

// Dashboard
export const getAllTickets = () =>
  api.get("/tickets");

// Tickets
export const getTicketById = (id) =>
  api.get(`/tickets/${id}`);

export const assignTicket = (id, staffId) =>
  api.put(`/tickets/${id}/assign`, { staffId });

// Tenants
export const getAllTenants = () =>
  api.get("/users/role/tenant");

export const getTenantById = (id) =>
  api.get(`/users/${id}`);
