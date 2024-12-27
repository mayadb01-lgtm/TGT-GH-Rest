import { Schema, model } from "mongoose";

const entrySchemaObj = new Schema(
  {
    id: { type: String, required: true },
    roomNo: { type: Number, required: true },
    cost: { type: Number },
    rate: { type: Number, required: true },
    noOfPeople: { type: Number },
    type: {
      type: String,
      enum: [
        "Single",
        "Couple",
        "Family",
        "Employee",
        "NRI",
        "Foreigner",
        "Other",
      ],
    },
    modeOfPayment: {
      type: String,
      enum: ["Cash", "Card", "PPS", "PPC", "UnPaid"],
      required: true,
    },
    fullname: { type: String, default: "" },
    mobileNumber: { type: Number, default: "" },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    date: { type: String, required: true },
    createDate: { type: String, required: true },
    period: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    isPaid: {
      type: Boolean,
      default: function () {
        return this.modeOfPayment === "UnPaid" ? false : true;
      },
    },
  },
  { timestamps: true }
);

const entrySchema = new Schema({
  entry: [entrySchemaObj],
  date: { type: String, required: true },
  // user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Entry", entrySchema);
