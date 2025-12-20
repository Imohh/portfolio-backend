import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  slug: string;
  name: string;
  email: string;
  text: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    slug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    website: { type: String },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);