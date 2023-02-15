import express from "express";
import verifyToken from '../middleware/verifyToken.js' 
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getById,
  getByUserId,
  updateBlog,
} from "../controllers/blog.js";
const blogRouter = express.Router();

blogRouter.get("/user",verifyToken,getByUserId);
blogRouter.get("/",verifyToken, getAllBlogs);
blogRouter.post("/",verifyToken,addBlog);
blogRouter.put("/:id",verifyToken,updateBlog);
blogRouter.get("/:id",verifyToken,getById);
blogRouter.delete("/:id",verifyToken,deleteBlog);

export default blogRouter;