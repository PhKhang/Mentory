import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

const search = async (req: Request, res: Response) => {
  const { search, role, skill } = req.query;

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

  var users: any[] = [];
  try {
    users = await prisma.user.findMany({
      where: {
        AND: [
          // do not include the current user
          // (decoded as any)?.email ? { NOT: { email: (decoded as any)?.email } } : undefined,
          // filter by role, search and skill
          role ? { role: role as string } : undefined,
          search
            ? {
                OR: [
                  { name: { contains: search as string, mode: "insensitive" } },
                  { bio: { contains: search as string, mode: "insensitive" } },
                  {
                    location: {
                      contains: search as string,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : undefined,
          skill
            ? {
                skills: {
                  has: skill as string,
                },
              }
            : undefined,
        ].filter(Boolean) as Prisma.UserWhereInput[],
      },
      include: {
        profile: true,
        receivedRequests: true,
        // sentRequests: true,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  console.log("Users: ", users.length);

  res.render("browse", {
    users: users,
  });
};

export { search };
