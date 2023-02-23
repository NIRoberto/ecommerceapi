import Product from "Product";
import catchAsync from "../utils/catchAsync";

export const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created success",
    product,
  });
});
