import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  getUser,
} from "../controllers/authController";
import { getProfilePage } from "../controllers/userController";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify", verifyEmail);
authRouter.get("/whoami", getUser);

export default authRouter;
