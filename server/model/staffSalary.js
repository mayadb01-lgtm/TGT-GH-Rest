import { Schema, model } from "mongoose";

const staffSalaryRowSchema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "RestStaff", required: true },
    fullname: { type: String, required: true, trim: true },
    // mobileNumber: { type: Number, required: true },
    // category: { type: String, required: true, trim: true },
    perDayPay: { type: Number, required: true, min: 0 },
    attendance: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    restaurantUpaad: { type: Number, default: 0, min: 0 },
    officeUpaad: { type: Number, default: 0, min: 0 },
    currentBalance: { type: Number, default: 0 },
    entryCreateDate: { type: Date },
    updatedDateTime: { type: Date, default: Date.now() },
    updatedDate: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

const staffSalarySchema = new Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    rows: [staffSalaryRowSchema],
    remarks: { type: String, trim: true, default: "" },
    createDate: { type: String },
    entryCreateDate: { type: Date },
    updatedDateTime: { type: Date, default: Date.now() },
    updatedDate: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

staffSalarySchema.index({ month: 1, year: 1 }, { unique: true });

export default model("StaffSalary", staffSalarySchema);
