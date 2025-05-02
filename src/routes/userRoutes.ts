import { Router } from "express";
import { editProfile } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/profile", editProfile);

export default userRouter;