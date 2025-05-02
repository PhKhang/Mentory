import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const getProfilePage = async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log("User ID: ", userId);
  
  // get current user from token
  const token = req.cookies?.access_token;

  if (!token) {
    console.log("No token");
    res.status(401).redirect("/");
    return;
  }

  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Error verifying token:", error);
  }

  var user;
  var isEditable = false;
  
  if (!userId) {
    if (!decoded) {
      console.log("No user ID and no token");
      res.status(401).redirect("/");
      return;
    }
    
    user = await prisma.user.findUnique({
      where: { id: (decoded as any)?.id },
      include: {
        profile: true,
      },
    });
  } else {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  }

  if (decoded && user?.id === (decoded as any)?.id) {
    isEditable = true;
  }
  res.render("profile", {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    profilePic: user?.profile?.imageUrl,
    jobTitle: user?.profile?.jobTitle,
    location: user?.profile?.location,
    rating: user?.profile?.rating,
    testimonials: [],
    role: user?.profile?.role,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills ? user?.profile?.skills?.split(",") : [],
    interests: user?.profile?.interests
      ? user?.profile?.interests?.split(",")
      : [],
    isEditable: isEditable,
  });
};

const editProfile = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    profilePic,
    jobTitle,
    location,
    bio,
    skills,
    interests,
  } = req.body;

  const token = req.cookies?.access_token;

  if (!token) {
    console.log("No token");
    res.status(401).redirect("/");
    return;
  }

  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" }).redirect("/");
    return;
  }

  if (decoded) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: (decoded as any)?.id },
        data: { firstName: firstName, lastName: lastName },
      });

      const updatedProfile = await prisma.profile.update({
        where: { userId: updatedUser.id },
        data: {
          imageUrl: profilePic,
          jobTitle,
          location,
          bio,
          skills: skills ? skills.join(",") : "",
          interests: interests ? interests.join(",") : "",
        },
      });

      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(400).json({ errorCode, errorMessage });
    }
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
};

export { getProfilePage, editProfile };
