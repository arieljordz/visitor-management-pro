export type AppointmentStatus = "pending" | "approved" | "declined";

export interface Appointment {
  id: string; // Unique identifier
  requestorId?: string; // User ID of the visitor who requested
  hostId?: string; // User ID of the host
  name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  hostName: string;
  visitDate: string; 
  appointmentDate: string; // ISO string for appointment date & time
  status: AppointmentStatus; // Current status of the appointment
  createdAt?: string; // Optional timestamp
  updatedAt?: string; // Optional timestamp
  notes?: string; // Optional notes from visitor or admin
}

export interface AppointmentTableProps {
  appointments: Appointment[];
  isAdmin: boolean;
  onEdit: (appt: Appointment) => void;
  onDelete: (appt: Appointment) => void;
  onApprove: (appt: Appointment) => void;
  onDecline: (appt: Appointment) => void;
}
