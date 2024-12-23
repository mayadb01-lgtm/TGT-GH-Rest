import { Schema, model } from "mongoose";

const entrySchemaObj = new Schema(
  {
    id: { type: String, required: true },
    roomNo: { type: Number, required: true },
    cost: { type: Number, required: true },
    rate: { type: Number, required: true },
    noOfPeople: { type: Number, required: true },
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
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["Cash", "Card", "UPI", "PPS", "PPC"],
      required: true,
    },
    fullname: { type: String, default: "" },
    mobileNumber: { type: Number, default: "" },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const entrySchema = new Schema({
  entry: [entrySchemaObj],
  date: { type: String, required: true },
  // user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Entry", entrySchema);
