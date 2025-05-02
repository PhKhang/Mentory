import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

const dashboard = async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;

  if (!token) {
    console.log("No token");
    res.render("landing", {});
    return;
  }

  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.render("landing", {});
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: (decoded as any)?.id },
    include: {
      profile: true,
      receivedRequests: {
        include: {
          fromUser: {
            include: {
              profile: true,
            },
          }
        }
      },
      sentRequests: {
        include: {
          toUser: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });

  const incommingRequests = user?.receivedRequests || [];
  const outgoingRequests = user?.sentRequests || [];

  var connectionCount = 0;
  connectionCount +=
    user?.receivedRequests.filter((request) => request.status === "ACCEPTED")
      .length || 0;
  connectionCount +=
    user?.sentRequests.filter((request) => request.status === "ACCEPTED")
      .length || 0;
  console.log("Connection count: ", connectionCount);

  var pendingCount = 0;
  pendingCount +=
    user?.receivedRequests.filter((request) => request.status === "PENDING")
      .length || 0;
  pendingCount +=
    user?.sentRequests.filter((request) => request.status === "PENDING")
      .length || 0;
  console.log("Pending count: ", pendingCount);

  return res.render("home", {
    user: user?.sentRequests,
    connectionCount,
    pendingCount,
    incommingRequests,
    outgoingRequests,
  });
};

const updateRequestFromTo = async (req: Request, res: Response) => {
  const { id, status } = req.body;
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
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  
  console.log("Update request from ", (decoded as any).id, " to ", id);
  try {
    const request = await prisma.mentorshipRequest.update({
      where: {
        fromUserId_toUserId: { toUserId: (decoded as any)?.id, fromUserId: id },
      },
      data: { status: status },
    });

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update mentorship request" });
  }
};

const connectUser = async (req: Request, res: Response) => {
  const { id } = req.body;
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
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const existingRequest = await prisma.mentorshipRequest.findFirst({
      where: {
        OR: [
          {
            fromUserId: (decoded as any)?.id,
            toUserId: id,
          },
          {
            fromUserId: id,
            toUserId: (decoded as any)?.id,
          },
        ],
      },
    });

    if (existingRequest) {
      console.log("Mentorship request already exists");
      res.status(400).json({ error: "Mentorship request already exists" });
      return;
    }

    const newRequest = await prisma.mentorshipRequest.create({
      data: {
        fromUserId: (decoded as any)?.id,
        toUserId: id,
        status: "PENDING",
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create mentorship request" });
  }
};

const getProfilePage = async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log("User ID: ", userId);

  // get current user from token
  const token = req.cookies?.access_token;

  if (!token) {
    console.log("No token");
    res.status(401).redirect("/register");
    return;
  }

  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).redirect("/register");
    return;
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
  
  console.log("Edit profile: ");

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

      console.log("Updated profile: ");
      
      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error updating profile:", errorCode, errorMessage);
      res.status(400).json({ errorCode, errorMessage });
    }
  } else {
    console.log("No user ID in token");
    res.status(401).json({ message: "User is not logged in" });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
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
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  console.log("Delete profile: ", (decoded as any)?.id);
  try {
    await prisma.user.delete({
      where: { id: (decoded as any)?.id },
    });
    
    res.clearCookie("access_token").status(200).redirect("/");
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
} 

export { getProfilePage, editProfile, connectUser, dashboard, updateRequestFromTo, deleteProfile };
