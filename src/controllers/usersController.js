import User from "../model/User";
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

  if (user) {
    return next(new AppError("User already exists", 409));
  }
  const newUser = await User.create(req.body);

  const token = await signToken(newUser);

  res.status(201).json({
    status: "success",
    message: "signup success",
    newUser,
    token,
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password", 400));
  }

  const user = await User.findOne({ username }).select("+password");

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
     
  const  s =  await User.deleteMany();
  res.status(200).json({
    status:"success",
    message:"all users deleted"
  })
})