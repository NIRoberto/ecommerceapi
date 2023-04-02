import { uploadToCloud } from "../helpers/cloud";
import Order from "../model/Order";
import Cart from "../model/Cart";
import Product from "../model/Product";
import Users from "../model/User";
import axios from "axios";
import AppError from "../utils/appError";
import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync";
import product from "../model/Product";

const createPayment = async (phoneNumber, totalAmount) => {
  console.log(phoneNumber, totalAmount);
  const body = {
    telephoneNumber: phoneNumber,
    amount: totalAmount,
    organizationId: process.env.MERCHANT_ID,
    description: "Payment for order",
    callbackUrl: "https://webhook.site/beeccdd5-ae23-4ec2-9390-0279598cba15",
  };

  try {
    const response = await axios.post(
      "https://opay-api.oltranz.com/opay/paymentrequest",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const createOrder = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ customerId: req.user._id });

  const times = cart.map((item) => item.numberOfItems);

  const allProductInCart = await Product.find({
    _id: { $in: cart.map((item) => item.productId) },
  });
  const structured = allProductInCart.map((item, index) => {
    return {
      productName: item.productName,
      productPrice: item.productPrice,
      vendorId: item.vendorId,
      times: times[index],
    };
  });

  const groupedProducts = structured.reduce((result, product) => {
    const vendorId = product.vendorId;
    if (!result[vendorId]) {
      result[vendorId] = [];
    }
    result[vendorId].push(product);
    return result;
  }, {});
  const renamedGroupedProducts = Object.keys(groupedProducts).reduce(
    (result, key) => {
      result.push({ vendorId: key, products: groupedProducts[key] });
      return result;
    },
    []
  );
  const totalAmount = renamedGroupedProducts.reduce((acc, item) => {
    const total = item.products.reduce((acc, item) => {
      return acc + item.productPrice * item.times;
    }, 0);
    return acc + total;
  }, 0);
  const response = await createPayment(req.body.phoneNumber, totalAmount);
  let newOrder;
  if (response.code == "200") {
    const howManyEachVendorEarn = renamedGroupedProducts.map((item) => {
      const total = item.products.reduce((acc, item) => {
        return acc + item.productPrice * item.times;
      }, 0);
      return total;
    });
    renamedGroupedProducts.forEach(async (item ,index) => {
      newOrder = await Order.create({
        customer: req.user,
        phoneNumber: req.body.phoneNumber,
        totalAmount: howManyEachVendorEarn[index],
        vendorId: item.vendorId,
        productOrdered: item.products,
        delivered: false,
      });
    });
    await Cart.deleteMany();
  } else {
    return next(new AppError(response.description, 400));
  }

  res.status(201).json({
    status: "success",
    message: "Order sent success",
    newOrder,
  });
});

export const getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({vendorId: req.user._id});

  return res.status(200).json({
    status: "success",
    size: orders.length,
    orders,
  });
});

export const getSingleCart = catchAsync(async (req, res, next) => {
  const Cart = await Cart.findById(req.params.id);
  if (!Cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
  });
});

export const removeFromOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Cart deleted success",
  });
});

export const deleteAllOrders = catchAsync(async (req, res, next) => {
  const s = await Order.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all Carts deleted",
  });
});

export const markAsDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      delivered: true,
    },
    { new: true, runValidators: true }
  );
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Order marked as delivered",
    order,
  });
});
