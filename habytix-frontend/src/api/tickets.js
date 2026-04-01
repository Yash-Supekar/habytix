import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/tickets`; // your springboot backend

export const getAllTickets = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getTicketById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const updateTicketStatus = async (id, status) => {
  const res = await axios.put(`${API_BASE}/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};
