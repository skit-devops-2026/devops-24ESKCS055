import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const posts = await Post.find(filter)
      .populate("author", "fullName username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "fullName username profilePic");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newPost = new Post({ title, category, description, author: req.user._id });
    await newPost.save();
    await newPost.populate("author", "fullName username profilePic");
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userIdStr = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userIdStr);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    await post.populate("author", "fullName username profilePic");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const votePost = async (req, res) => {
  try {
    const { stance } = req.body; // "for" or "against"
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userIdStr = req.user._id.toString();
    const alreadyFor = post.votesFor.some((id) => id.toString() === userIdStr);
    const alreadyAgainst = post.votesAgainst.some((id) => id.toString() === userIdStr);

    post.votesFor = post.votesFor.filter((id) => id.toString() !== userIdStr);
    post.votesAgainst = post.votesAgainst.filter((id) => id.toString() !== userIdStr);

    if (stance === "for" && !alreadyFor) {
      post.votesFor.push(req.user._id);
    } else if (stance === "against" && !alreadyAgainst) {
      post.votesAgainst.push(req.user._id);
    }

    await post.save();
    await post.populate("author", "fullName username profilePic");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};