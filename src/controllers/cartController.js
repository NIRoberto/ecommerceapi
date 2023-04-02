import { uploadToCloud } from "../helpers/cloud";
import Cart from "../model/Cart";
import Product from "../model/Product";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const AddToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  const cartExits = await Cart.findOne({ productId: req.params.id });
  let itemNumber = 0,
    cart;
  if (cartExits) {
    itemNumber = Number(cartExits.numberOfItems) + 1;
    cart = await Cart.findByIdAndUpdate(
      cartExits._id,
      {
        numberOfItems: itemNumber,
      },
      { new: true, runValidators: true }
    );
  } else {
    cart = await Cart.create({
      customerId: req.user._id,
      productId: req.params.id,
      numberOfItems: 1,
    });
  }
  res.status(201).json({
    status: "success",
    message: "Product added to cart success",
    cart,
  });
});

export const getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await Cart.find();

  return res.status(200).json({
    status: "success",
    size: carts.length,
    carts,
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

export const removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
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
