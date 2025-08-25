import visitorModel from "../models/visitorModel.js";

// Helper to normalize MongoDB visitor documents
const normalizeVisitor = (doc) => ({
  id: doc._id.toString(),
  firstname: doc.firstname,
  middlename: doc.middlename || "",
  lastname: doc.lastname,
  fullname: doc.fullname,
  email: doc.email,
  phone: doc.phone,
  company: doc.company || "",
  hostId: doc.hostId?._id?.toString() || null,
  hostName: doc.hostId?.name || "",
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// ✅ GET all visitors
// ✅ GET all visitors (with pagination)
export const getVisitors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [visitors, total] = await Promise.all([
      visitorModel
        .find()
        .populate("hostId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      visitorModel.countDocuments(),
    ]);

    const normalized = visitors.map(normalizeVisitor);
    res.status(200).json({
      visitors: normalized,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitors", error });
  }
};

// ✅ GET single visitor by ID
export const getVisitorById = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await visitorModel
      .findById(id)
      .populate("hostId", "name email");

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    const normalized = normalizeVisitor(visitor);
    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitor", error });
  }
};

// ✅ SEARCH visitors by query term
export const searchVisitors = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = q
      ? {
          $or: [
            { firstname: { $regex: q, $options: "i" } },
            { lastname: { $regex: q, $options: "i" } },
            { fullname: { $regex: q, $options: "i" } },
            { company: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [visitors, total] = await Promise.all([
      visitorModel
        .find(query)
        .populate("hostId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      visitorModel.countDocuments(query),
    ]);

    const normalized = visitors.map(normalizeVisitor);
    res.status(200).json({
      visitors: normalized,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to search visitors", error });
  }
};

// ✅ CREATE visitor
export const addVisitor = async (req, res) => {
  try {
    const { firstname, middlename, lastname, email, phone, address, company } =
      req.body;

    // ✅ hostId comes from authenticated user
    const hostId = req.user?._id;
    if (!hostId) {
      return res.status(401).json({ message: "Unauthorized: hostId missing" });
    }

    const newVisitor = await visitorModel.create({
      firstname,
      middlename,
      lastname,
      email,
      phone,
      address,
      company,
      hostId,
    });

    const populated = await newVisitor.populate("hostId", "name email");
    res.status(201).json(normalizeVisitor(populated));
  } catch (error) {
    console.error("Error adding visitor:", error);
    res.status(500).json({ message: "Failed to create visitor", error });
  }
};

// ✅ UPDATE visitor
export const updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVisitor = await visitorModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("hostId", "name email");

    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json(normalizeVisitor(updatedVisitor));
  } catch (error) {
    res.status(500).json({ message: "Failed to update visitor", error });
  }
};

// ✅ DELETE visitor
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await visitorModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete visitor", error });
  }
};
