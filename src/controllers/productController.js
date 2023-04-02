import { uploadToCloud } from "../helpers/cloud";
import Product from "../model/Product";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const createProduct = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }
  const result = await uploadToCloud(req.file, res);

  const product = await Product.create({
    image: result
      ? result.secure_url
      : "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/71jmjOxxE3L.jpg",
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    productCategory: req.body.productCategory,
    productDescription: req.body.productDescription,
    vendorId: req.user._id,
  });

  res.status(201).json({
    status: "success",
    message: "Product created success",
    product,
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Product.find();

  return res.status(200).json({
    status: "success",
    size: allProducts.length,
    allProducts,
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    product,
  });
});
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  let result;
  if (req.file) {
    result = await uploadToCloud(req.file, res);
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      productName: req.body.productName,
      productPrice: req.body.productPrice,
      image: result ? result.secure_url : product.image,
      productCategory: req.body.productCategory,
      productDescription: req.body.productDescription,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product updated success",
    updatedProduct,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Product deleted success",
  });
});

export const deleteAllProducts = catchAsync(async (req, res, next) => {
  const s = await Product.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all products deleted",
  });
});
