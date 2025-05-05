import { Router, Request, Response } from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import upload from "../config/upload";

const apiRouter = Router();

apiRouter.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return 
    }
    console.log((req.file as any).key);
    res.status(200).send({
      filename: `${new URL((req.file as any).key, process.env.R2_ENDPOINT)}`,
    });
  }
);
apiRouter.use(authRouter);
apiRouter.use(userRouter);

export default apiRouter;
