import User from "../model/User";
import Product from "../model/Product";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";

const signToken = async (user) => {
  return await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    size: users.length,
    users,
  });
});

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body);
  if (user) {
    return next(new AppError("User already exists", 409));
  }
  if (
    req.body.roleId == 2 &&
    (!req.body.phone ||
      !req.body.shopName ||
      !req.body.shopDescription ||
      !req.body.shopAddress ||
      !req.body.idNumber)
  ) {
    return next(
      new AppError(
        "Please provide phone, shopName, id number, shop description ,shop address",
        400
      )
    );
  }

  let newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    roleId: req.body.roleId,
    phone: req.body.phone,
    shopName: req.body.shopName,
    shopAddress: req.body.shopAddress,
    shopDescription: req.body.shopDescription,
    idNumber: req.body.idNumber,
  });

  const token = await signToken(newUser);

  res.status(201).json({
    status: "success",
    message: "signup success",
    newUser,
    token,
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  const token = await signToken(user);

  res.status(200).json({
    status: "success",
    message: "login success",
    token,
    user,
  });
});

export const deleteAllUsers = catchAsync(async (req, res, next) => {
  const s = await User.deleteMany();
  res.status(200).json({
    status: "success",
    message: "all users deleted",
  });
});

export const deleteOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.roleId == 2) {
    await Product.deleteMany({ vendorId: req.params.id });
  }
  res.status(200).json({
    status: "success",
    message: "user deleted",
  });
});

export const updateOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const newUserData = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      shopName: req.body.shopName,
      roleId: req.body.roleId,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "user updated",
    newUserData,
  });
});

export const getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    user,
  });
});

export const changeStatusUserToVendor = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    roleId: 2,
    status: req.body.status,
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "user status changed to vendor",
  });
});

export const getVendors = catchAsync(async (req, res, next) => {
  const vendors = await User.find({ roleId: 2 });

  res.status(200).json({
    status: "success",
    size: vendors.length,
    vendors,
  });
});
