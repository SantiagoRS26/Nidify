import { Schema, model, Document } from 'mongoose';
import { Category } from '../../../domain/models/category.model';

interface CategoryDocument extends Document, Omit<Category, 'id'> {}

const CategorySchema = new Schema<CategoryDocument>({
  householdId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number },
  isBase: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CategorySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const CategoryModel = model<CategoryDocument>(
  'Category',
  CategorySchema,
);
