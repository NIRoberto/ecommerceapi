import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user";
import productRoute from "./routes/product";
import AppError from "./utils/appError";
import globalErrorHandle from "./controllers/errorController";
import upload from "./helpers/multer";
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.single("image"));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to e commerce API",
  });
});

app.use("/api/zeus/users", userRoute);
app.use("/api/zeus/products", productRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandle);

export default app;
