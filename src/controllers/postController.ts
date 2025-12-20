import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import cloudinary from '../config/cloudinary';

// Create Post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, author, date, slug, summary, content, coverImage } = req.body;

    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

    // Handle cover image upload
    let coverImageUrl: string | undefined = undefined;
    if (coverImage?.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(coverImage, {
        folder: 'portfolio-blog-covers',
      });
      coverImageUrl = result.secure_url;
    }

    // Process content blocks with images
    const processedContent = await Promise.all(
      parsedContent.map(async (block: any) => {
        if (block.type === 'image' && block.src?.startsWith('data:')) {
          try {
            const result = await cloudinary.uploader.upload(block.src, {
              folder: 'portfolio-blog',
            });
            return { ...block, src: result.secure_url };
          } catch (err) {
            console.error('Error uploading image:', err);
            return block;
          }
        }
        return block;
      })
    );

    const postDoc = await Post.create({
      id: Date.now().toString(),
      name,
      author,
      date,
      slug,
      summary,
      coverImage: coverImageUrl,
      content: processedContent,
    });

    res.status(201).json(postDoc);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get All Posts
export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get Post by Slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Update Post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, summary, content, coverImage } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    let coverImageUrl: string | undefined = post.coverImage;
    if (coverImage?.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(coverImage, {
        folder: 'portfolio-blog-covers',
      });
      coverImageUrl = result.secure_url;
    }

    post.name = name || post.name;
    post.summary = summary || post.summary;
    post.content = content ? (typeof content === 'string' ? JSON.parse(content) : content) : post.content;
    post.coverImage = coverImageUrl;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete Post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Add Comment
export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const { name, email, text, website } = req.body;

  if (!name || !email || !text) {
    res.status(400).json({ error: 'Name, email, and text are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  try {
    const comment = new Comment({ slug, name, email, text, website });
    await comment.save();

    const comments = await Comment.find({ slug }).sort({ createdAt: -1 });
    res.status(201).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get Comments
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ slug: req.params.slug }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
