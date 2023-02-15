import express from "express"; 
import {
  handleRegister,
  handleLogin,
  handleForget,
  handleReset,
} from "../controllers/auth.js";
const userRouter = express.Router(); 

userRouter.post("/register", handleRegister);

userRouter.post("/login", handleLogin);

userRouter.post("/forgot", handleForget); 

userRouter.post("/reset", handleReset);

export default userRouter;