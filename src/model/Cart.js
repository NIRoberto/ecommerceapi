import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: [true, "product name field is required"],
  },
  productId: {
    type: String,
    required: [true, "product image field is required"],
  },
  numberOfItems: {
    type: Number,
    default: 1,
  },
});

const user = mongoose.model("Cart", cartSchema);

export default user;
