import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Product name field is required"],
  },
  image: {
    type: String,
    required: [true, "Image  is required"],
  },
  productCategory: {
    type: String,
    required: [true, "Product category field is required"],
  },
  productPrice: {
    type: String,
    required: [true, "Price of product is field is required"],
  },
  productDescription: {
    type: String,
    required: [true, "Description of product is required"],
  },
  vendorId: {
    type: String,
  },
});
const product = mongoose.model("Product", productSchema);
export default product;
