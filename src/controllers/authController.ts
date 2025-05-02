import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/prisma";

dotenv.config();

const getUser = async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  
  if (!token) {
    console.log("No token")
    res.status(401).json({ error: 'Not logged in' })
    return 
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  console.log("Decoded token: ", decoded)
  console.log("Username: ", (decoded as any)?.username)
  res.json(decoded)
};

const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const userWithTheEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userWithTheEmail) {
      res.status(200).json({ message: "Email is already used" });
      return;
    }

    res.status(400).json({ message: "Email is not used" });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

const createToken = (user: any, duration: any = "30d") => {
  const payload = { id: user?.id, email: user?.email };
  const secret: Secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: '30d',
  };

  return jwt.sign(payload, secret, {expiresIn: '30d'});
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

  console.log("Registering user:", req.body);

  if (!["MENTOR", "MENTEE"].includes(role)) {
    console.error("Invalid role:", role);
    res.status(400).json({ message: "Invalid role. 'MENTOR' or 'MENTEE'." });
    return;
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const usr = await prisma.user.create({
      data: {
        firebaseId: "",
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: hash,
      },
    });

    const prof = await prisma.profile.create({
      data: {
        userId: usr.id,
        role,
      },
    });

    const token = createToken(usr, "10m");

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ status: "logged in" });

    // res.status(200).json({ message: "User registered successfully", usr });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);
    res.status(400).json({ errorCode, errorMessage });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.error("User not found:", email);
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      console.error("Invalid password for user:", email);
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = createToken(user, "10m");

    console.log("User logged in successfully");
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ status: "logged in" });
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error logging in user:", errorCode, errorMessage);
    res.status(400).json({ message: "Wrong password or email" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token").status(200).redirect("/");
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(400).json({ errorCode, errorMessage });
  }
};

export { register, login, logout, verifyEmail, getUser };
