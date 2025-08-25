// src/services/appointmentService.ts
import axios from "axios";
import type { Appointment } from "@/types/appointment";

const API_URL = import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies/session
});

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await api.get("/api/appointments");
  return res.data; // backend should return an array of Appointment objects directly
};

// Search appointments by query
export const searchAppointments = async (q: string): Promise<Appointment[]> => {
  const res = await api.get("/api/appointments/search", { params: { q } });
  return res.data; // backend returns array of Appointment
};

// Add a new appointment
export const addAppointment = async (
  appointment: Omit<Appointment, "id" | "status" | "appointmentDate">
): Promise<Appointment> => {
  const res = await api.post("/api/appointments", appointment);
  return res.data; // backend returns created Appointment
};

// Update an existing appointment
export const updateAppointment = async (
  appointment: Appointment
): Promise<Appointment> => {
  const res = await api.put(`/api/appointments/${appointment.id}`, appointment);
  return res.data; // backend returns updated Appointment
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/api/appointments/${id}`);
  return res.data; // returns { message: string }
};

// Approve an appointment
export const approveAppointment = async (id: string): Promise<Appointment> => {
  const res = await api.put(`/api/appointments/${id}/approve`);
  return res.data; // returns updated Appointment
};

// Decline an appointment
export const declineAppointment = async (id: string): Promise<Appointment> => {
  const res = await api.put(`/api/appointments/${id}/decline`);
  return res.data; // returns updated Appointment
};
