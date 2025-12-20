import mongoose, { Schema, Document } from 'mongoose';

interface IContentBlock {
  id: string;
  type: 'text' | 'image';
  content?: string;
  src?: string;
  caption?: string;
}

export interface IPost extends Document {
  id: string;
  name: string;
  author: string;
  date: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  content: IContentBlock[];
  contentType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String },
  src: { type: String },
  caption: { type: String },
});

const PostSchema = new Schema<IPost>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    coverImage: { type: String },
    content: [ContentBlockSchema],
    contentType: { type: String },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);