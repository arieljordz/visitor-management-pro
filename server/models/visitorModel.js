import mongoose from "mongoose";

const visitorModelSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    middlename: { type: String, required: false },
    lastname: { type: String, required: true },
    fullname: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate fullname
visitorModelSchema.pre("save", function (next) {
  const middleInitial = this.middlename
    ? `${this.middlename.charAt(0).toUpperCase()}.`
    : "";

  this.fullname = [this.firstname, middleInitial, this.lastname]
    .filter(Boolean) // remove empty parts
    .join(" ");

  next();
});

const visitorModel = mongoose.model("visitorModel", visitorModelSchema);
export default visitorModel;
