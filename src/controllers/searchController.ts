import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { Prisma, Role } from "@prisma/client";

const search = async (req: Request, res: Response) => {
  var { search, role, skill } = req.query;

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
  if (skill === "All") {
    skill = undefined;
  }
  var allSkills: string[] = [];
  try {
    const profiles = await prisma.profile.findMany({
      select: {
        skills: true,
      },
    });

    allSkills = profiles
      .filter((profile) => profile.skills && profile.skills.trim() !== "") // Filter out null/empty skills
      .flatMap(
        (profile) =>
          (profile as any)?.skills
            .split(",") // Split the skills string by comma (adjust based on your format)
            .map((skill: string) => skill.trim()) // Trim whitespace from each skill
            .filter((skill: string) => skill !== "") // Remove empty skills after splitting
      );
    allSkills = [...new Set(allSkills)];

    const roleMatch =
      (search as string)?.toUpperCase() === "MENTOR" ||
      (search as string)?.toUpperCase() === "MENTEE"
        ? {
            profile: {
              role: (search as string).toUpperCase() as Role,
            },
          }
        : undefined;

    users = await prisma.user.findMany({
      where: {
        AND: [
          // do not include the current user
          (decoded as any)?.email
            ? { NOT: { email: (decoded as any)?.email } }
            : undefined,
          // filter by role, search and skill
          role ? { role: role as string } : undefined,
          search
            ? {
                OR: [
                  {
                    firstName: {
                      contains: search as string,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      contains: search as string,
                      mode: "insensitive",
                    },
                  },
                  roleMatch,
                ],
              }
            : undefined,
          skill
            ? {
                profile: {
                  skills: {
                    contains: skill as string,
                    mode: "insensitive",
                  },
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
    search: search,
    skill: skill,
    allSkills: allSkills,
  });
};

export { search };
