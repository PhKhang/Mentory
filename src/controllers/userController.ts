import { Request, Response } from "express";
import prisma from "../config/prisma";
import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";

const getProfilePage = async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  var user;
  
  if (!userId) {
    const firebaseId = auth.currentUser?.uid;
    if (!firebaseId) {
      res.status(401).json({ message: "User is not logged in" });
      return;
    }
    
    user = await prisma.user.findUnique({
      where: { firebaseId: firebaseId },
      include: {
        profile:  true
      },
    });
  }
  else {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile:  true
      },
    });
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
    skills: user?.profile?.skills ? user?.profile?.skills?.split(","): [], 
    interests: user?.profile?.interests ? user?.profile?.interests?.split(",") : [],
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
  
  console.log("Received data:", req.body);

  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePic,
      });

      const updatedUser = await prisma.user.update({
        where: { firebaseId: user.uid },
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
