import { uploadToCloud } from "../helpers/cloud";
import Cart from "../model/Cart";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const AddToCart = catchAsync(async (req, res, next) => {
  console.log(req.user._id);

  const result = await uploadToCloud(req.file, res);

  const Cart = await Cart.create({
    CartCategory: req.body.CartCategory,
    CartDescription: req.body.CartDescription,
  });

  res.status(201).json({
    status: "success",
    message: "Cart created success",
    Cart,
  });
});

export const getAllCarts = catchAsync(async (req, res, next) => {
  const allCarts = await Cart.find();

  return res.status(200).json({
    status: "success",
    size: allCarts.length,
    allCarts,
  });
});

export const getSingleCart = catchAsync(async (req, res, next) => {
  const Cart = await Cart.findById(req.params.id);
  if (!Cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
    Cart,
  });
});
export const updateCart = catchAsync(async (req, res, next) => {
  const Cart = await Cart.findById(req.params.id);
  if (!Cart) {
    return next(new AppError("Cart not found", 404));
  }
  let result;
  if (req.file) {
    result = await uploadToCloud(req.file, res);
  }
  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      CartPrice: req.body.CartPrice,
      CartCategory: req.body.CartCategory,
      CartDescription: req.body.CartDescription,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Cart updated success",
    updatedCart,
  });
});

export const deleteCart = catchAsync(async (req, res, next) => {
  const Cart = await Cart.findById(req.params.id);
  if (!Cart) {
    return next(new AppError("Cart not found", 404));
  }
  await Cart.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "Cart deleted success",
  });
});

export const deleteAllCarts = catchAsync(async (req, res, next) => {
  const s = await Cart.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all Carts deleted",
  });
});
