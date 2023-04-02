import jwt from "jsonwebtoken";
import user from "../model/User";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";


const Authorization = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Login please you are unauthorized", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const loggedUser = await user.findById(decoded.id);
  if (!loggedUser) {
    return next(new AppError("Token has expired  login  again please", 401));
  }
  req.user = loggedUser;
  next();
});

export default Authorization;
