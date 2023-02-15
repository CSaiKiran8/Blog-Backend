import mongoose from "mongoose"; 
import Blog from "../models/Blog.js"; 

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) return res.status(404).send("No Blogs Found");
    res.status(200).send(blogs);
  } catch (err) {
    res.send(err);
  }
};

export const addBlog = async (req, res, next) => {
  const { id, name } = req.user;
  const { title, desc, image } = req.body;
  try {
    const blog = await Blog.create({ title, desc, image, userId: id, name });
    res.status(201).send("Blog created successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateBlog = async (req, res, next) => {
  const { title, desc, img } = req.body;
  const blogId = req.params.id;
  try {
    const blog = await Blog.findOneAndUpdate(
      { blogId },
      { title, desc, img },
      { new: true }
    );
    res.status(200).send("Updated successfully");
  } catch (err) {
    res.send(err);
  }
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send("No Blog Found");
    res.status(200).send(blog);
  } catch (err) {
    res.send(err);
  }
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Blog.findByIdAndDelete({ _id: id });
    res.status(200).send("Successfully Delete");
  } catch (err) {
    res.send(err);
  }
};

export const getByUserId = async (req, res, next) => {
  const { id, name } = req.user;
  try {
    const blogs = await Blog.find({ userId: id });
    res.status(200).send({ blogs, name });
  } catch (err) {
    res.send(err);
  }
};