import { Request, Response } from "express";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

const register = async (req: Request, res: Response) => {
  //   const { email, password } = req.body;
  const { email, password } = {
    email: "trannguyenphuckhang12@gmail.com",
    password: "Password1234",
  };
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    res.status(200).json({ message: "User registered successfully", user });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

const login = async (req: Request, res: Response) => {
  //   const { email, password } = req.body;
  const { email, password } = {
    email: "trannguyenphuckhang12@gmail.com",
    password: "Password1234",
  };
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

export { register, login, logout };