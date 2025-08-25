import appointmentModel from "../models/appointmentModel.js";

// Helper to normalize MongoDB appointment documents
const normalizeAppointment = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  company: doc.company || "",
  hostName: doc.hostName,
  purpose: doc.purpose,
  visitDate: doc.visitDate,
  appointmentDate: doc.appointmentDate || doc.visitDate,
  status: doc.status || "pending",
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
  notes: doc.notes || "",
});

// GET all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().sort({ visitDate: 1 });
    const normalized = appointments.map(normalizeAppointment);
    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error });
  }
};

// GET filtered appointments by search term
export const searchAppointments = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { hostName: { $regex: q, $options: "i" } },
            { purpose: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const appointments = await appointmentModel.find(query).sort({ visitDate: 1 });
    const normalized = appointments.map(normalizeAppointment);
    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Failed to search appointments", error });
  }
};

// CREATE appointment
export const addAppointment = async (req, res) => {
  try {
    const { name, email, phone, company, hostName, purpose, visitDate } = req.body;

    const newAppointment = await appointmentModel.create({
      name,
      email,
      phone,
      company,
      hostName,
      purpose,
      visitDate,
      appointmentDate: new Date(),
      status: "pending",
    });

    res.status(201).json(normalizeAppointment(newAppointment));
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error });
  }
};

// UPDATE appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(normalizeAppointment(updatedAppointment));
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment", error });
  }
};

// DELETE appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await appointmentModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment", error });
  }
};

// APPROVE appointment
export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(normalizeAppointment(appointment));
  } catch (error) {
    res.status(500).json({ message: "Failed to approve appointment", error });
  }
};

// DECLINE appointment
export const declineAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "declined" },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(normalizeAppointment(appointment));
  } catch (error) {
    res.status(500).json({ message: "Failed to decline appointment", error });
  }
};
