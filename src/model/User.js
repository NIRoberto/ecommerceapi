import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name field is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name field is required"],
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  profile: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  password: {
    type: String,
    required: [true, "password field is required"],
    minLength: 6,
    maxLength: 12,
    select: false,
  },
  shopName: {
    type: String,
  },
  phone: {
    type: String,
  },
  roleId: {
    type: Number,
    enum: [1, 2, 3],
    default: 3,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

userSchema.methods.correctPassword = async function (cpassword, password) {
  return await bcrypt.compare(cpassword, password);
};

const user = mongoose.model("User", userSchema);

export default user;
