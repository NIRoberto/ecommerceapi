import AppError from "../utils/appError";

const CartAuth = (req, res, next) => {
  if (req.user.roleId == 3) {
    next();
  } else {
    return next(new AppError("Only customer can do this  operation", 403));
  }
};

export default CartAuth;
