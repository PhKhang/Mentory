import { Router } from "express";
import { connectUser, dashboard, deleteProfile, editProfile, updateRequestFromTo } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/profile", editProfile);
userRouter.post("/connect", connectUser);
userRouter.put("/update-request", updateRequestFromTo);
userRouter.delete("/profile/delete", deleteProfile);

export default userRouter;