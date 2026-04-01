import api from "./axios";

export const getAssignedTickets = () =>
  api.get("/tickets/assigned");

export const updateTicketStatus = (id, status) =>
  api.put(`/tickets/${id}/status`, { status });

export const getStaffProfile = () =>
  api.get("/users/me");
