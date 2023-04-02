import { uploadToCloud } from "../helpers/cloud";
import Category from "../model/Category";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const addCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.body;
  if (!req.file) {
    return next(new AppError("Please upload image", 400));
  }
  const image = await uploadToCloud(req.file, res);
  const newCategory = new Category({
    categoryName,
    image: image.secure_url,
  });
  const savedCategory = await newCategory.save();
  res.status(201).json({
    status: "success",
    message: "Category added success",
    savedCategory,
  });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    size: categories.length,
    categories,
  });
});

export const getSingleCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    category,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Category deleted success",
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.body;
  let image;
  if (req.file) {
    image = await uploadToCloud(req.file, res);
  }
  const categoryToUpdate = await Category.findById(req.params.id); // Find the category to update
  let updatedCategory;

  if (categoryToUpdate) {
    updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName: categoryName || categoryToUpdate.categoryName,
        image: image ? image.secure_url : categoryToUpdate.image,
      },
      { new: true, runValidators: true }
    );
  }
  res.status(200).json({
    status: "success",
    message: "Category updated success",
    updatedCategory,
  });
});
