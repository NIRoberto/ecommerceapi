import AppError from "../utils/appError";

const AdminAuth = (req, res, next) => {
  if (req.user.roleId == 1) {
    next();
  } else {
    return next(new AppError("Only admin can do this  operation", 403));
  }
};

export default AdminAuth;
