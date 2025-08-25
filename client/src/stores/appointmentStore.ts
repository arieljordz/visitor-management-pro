import { create } from "zustand";
import * as appointmentService from "@/services/appointmentService";
import { useSpinnerStore } from "./spinnerStore";
import { Appointment } from "@/types/appointment";

const showSpinner = () => useSpinnerStore.getState().show();
const hideSpinner = () => useSpinnerStore.getState().hide();

interface AppointmentStore {
  appointments: Appointment[];
  searchTerm: string;
  message: string | null;
  setSearchTerm: (term: string) => void;

  fetchAppointments: () => Promise<void>;
  searchAppointments: (q: string) => Promise<void>;
  addAppointment: (
    appointment: Omit<Appointment, "id" | "status" | "appointmentDate">
  ) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  approveAppointment: (id: string) => Promise<void>;
  declineAppointment: (id: string) => Promise<void>;
  clearMessage: () => void;
}

export const useAppointmentsStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  searchTerm: "",
  message: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  clearMessage: () => set({ message: null }),

  fetchAppointments: async () => {
    showSpinner();
    try {
      const data = await appointmentService.getAppointments();
      //   console.log("Fetched appointments:", data);
      set({ appointments: data, message: null });
    } catch (err: any) {
      set({ message: err?.message || "Error fetching appointments" });
      set({ appointments: [] });
    } finally {
      hideSpinner();
    }
  },

  searchAppointments: async (q: string) => {
    showSpinner();
    try {
      const data = await appointmentService.searchAppointments(q);
      console.log("Searched appointments:", data);
      set({ appointments: data, message: null });
    } catch (err: any) {
      set({ message: err?.message || "Error searching appointments" });
      set({ appointments: [] });
    } finally {
      hideSpinner();
    }
  },

  addAppointment: async (appointment) => {
    showSpinner();
    try {
      const newAppointment = await appointmentService.addAppointment(
        appointment
      );
      console.log("Added appointment:", newAppointment);
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        message: "Appointment added successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to add appointment" });
    } finally {
    //   hideSpinner();
    }
  },

  updateAppointment: async (appointment) => {
    showSpinner();
    try {
      const updated = await appointmentService.updateAppointment(appointment);
      console.log("Updated appointment:", updated);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === updated.id ? updated : a
        ),
        message: "Appointment updated successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to update appointment" });
    } finally {
      hideSpinner();
    }
  },

  deleteAppointment: async (id) => {
    showSpinner();
    try {
      await appointmentService.deleteAppointment(id);
      set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== id),
        message: "Appointment deleted successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to delete appointment" });
    } finally {
      hideSpinner();
    }
  },

  approveAppointment: async (id) => {
    showSpinner();
    try {
      const updated = await appointmentService.approveAppointment(id);
      console.log("Approved appointment:", updated);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === updated.id ? updated : a
        ),
        message: "Appointment approved successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to approve appointment" });
    } finally {
      hideSpinner();
    }
  },

  declineAppointment: async (id) => {
    showSpinner();
    try {
      const updated = await appointmentService.declineAppointment(id);
      console.log("Declined appointment:", updated);
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === updated.id ? updated : a
        ),
        message: "Appointment declined successfully",
      }));
    } catch (err: any) {
      set({ message: err?.message || "Failed to decline appointment" });
    } finally {
      hideSpinner();
    }
  },
}));
