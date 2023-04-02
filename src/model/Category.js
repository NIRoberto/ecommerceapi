import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "product name field is required"],
  },
  image: {
    type: String,
    required: [true, "product image field is required"],
  },
});

const category = mongoose.model("Category", categorySchema);

export default category;
