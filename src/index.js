import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
