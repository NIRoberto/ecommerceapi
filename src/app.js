import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user";
import multer from "multer";
import AppError from "./utils/appError";
import globarErrorHandle from "./controllers/errorController";
const app = express();
const upload = multer({ dest: "image" });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(upload.any());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to e commerce API",
  });
});

app.use("/api/v1", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globarErrorHandle);

export default app;
