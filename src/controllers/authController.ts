import { Request, Response } from "express";
import { auth, authAdmin } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import prisma from "../config/prisma";

const getUser = async (req: Request, res: Response) => {
  const user = auth.currentUser;
  if (user) {
    res.status(200).json({ message: "User is logged in", user });
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await authAdmin.getUserByEmail(email);
    if (user.emailVerified) {
      res.status(200).json({ message: "Email is verified" });
    } else {
      res.status(200).json({ message: "Email is not verified" });
    }
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

const register = async (req: Request, res: Response) => {
  console.log("In the function");
  const {
    email,
    password,
    role,
    "first-name": firstName,
    "last-name": lastName,
  } = req.body;
  // const { email, password } = {
  //   email: "trannguyenphuckhang12@gmail.com",
  //   password: "Password1234",
  // };
  
  console.log("Registering user:", req.body);

  if (!["MENTOR", "MENTEE"].includes(role)) {
    console.error("Invalid role:", role);
    res.status(400).json({ message: "Invalid role. 'MENTOR' or 'MENTEE'." });
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // updateProfile(userCredential.user, {
    //   displayName: `${firstName} ${lastName}`,
    // });

    const user = userCredential;
    const usr = await prisma.user.create({
      data: {
        firebaseId: user.user.uid,
        email: user.user.email!,
        firstName: firstName,
        lastName: lastName,
      },
    });

    const prof = await prisma.profile.create({
      data: {
        userId: usr.id,
        role,
      },
    });

    res.status(200).json({ message: "User registered successfully", user });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);
    res.status(400).json({ errorCode, errorMessage });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // const { email, password } = {
  //   email: "trannguyenphuckhang12@gail.com",
  //   password: "Password1234",
  // };
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
    res.status(400).json({ message: "Wrong password or email" });
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

export { register, login, logout, verifyEmail, getUser };
