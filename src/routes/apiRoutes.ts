import { Router } from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";

const apiRouter = Router();

apiRouter.use(authRouter);
apiRouter.use(userRouter);

export default apiRouter;