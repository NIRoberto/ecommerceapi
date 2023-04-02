import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    type: Object,
    required: [true, "product name field is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "phone number field is required"],
  },
  vendorId: {
    type: String,
  },
  productOrdered: {
    type: Array,
    required: [true, "product image field is required"],
  },
  totalAmount: {
    type: Number,
    default: 1,
  },
  date: { type: Date, default: Date.now },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
