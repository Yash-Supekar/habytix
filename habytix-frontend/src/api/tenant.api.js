import api from "./axios";

export const getMyTickets = () =>
  api.get("/tickets/my");

export const createTicket = (data) =>
  api.post("/tickets", data);

export const getTicketDetails = (id) =>
  api.get(`/tickets/${id}`);

export const getTenantProfile = () =>
  api.get("/users/me");

export const updateTenantProfile = (data) =>
  api.put("/users/me", data);
