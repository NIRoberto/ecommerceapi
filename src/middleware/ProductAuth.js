import AppError from "../utils/appError";

const ProductAuth = (req, res, next) => {
  console.log(req.user._id);
  if (req.user.roleId == 2) {
    next();
  } else {
    return next(new AppError("Only vendor can do this  operation", 403));
  }
};

export default ProductAuth;
