import { Request, Response, Router } from "express";
import { auth } from "../config/firebase";
import { engine } from "express-handlebars";
import { getProfilePage } from "../controllers/userController";

const viewRouter = Router();

viewRouter.get("/", (req: Request, res: Response) => {
  const user = auth.currentUser;
  return res.render("home", {});
  // if (user) {
  //   res.send(`Hello ${user.email}`);
  // } else {
  //   res.send("Hello Guest");
  // }
});

viewRouter.get("/login", (req: Request, res: Response) => {
  return res.render("login", {});
});

viewRouter.get("/register", (req: Request, res: Response) => {
  return res.render("register", {});
});
0;

viewRouter.get("/logout", (req: Request, res: Response) => {
  res.send(
    `
      <button id="logoutBtn">Logout</button>
      <script>
        document.getElementById('logoutBtn').addEventListener('click', async () => {
          try {
            const res = await fetch('api/logout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
  
            const data = await res.json();
            alert(data.message);  // Display the response message
          } catch (error) {
            alert('Logout failed!');
          }
        });
      `
  );
});

viewRouter.get("/profile", getProfilePage);

viewRouter.get("/me", (req: Request, res: Response) => {
  const user = auth.currentUser;
  res.render("profile", {
    firstName: "Alex",
    lastName: "Johnson",
    email: "mail.com",
    profilePic:
      "https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Sami-Viitama%CC%88ki-.jpeg",
    jobTitle: "Senior Software Engineer",
    location: "San Francisco, CA",
    rating: 4.5,
    testimonials: [],
    role: "Mentor",
    bio: "10+ years of experience in full-stack development. Passionate about mentoring junior developers and helping them grow in their careers. I've worked at several tech companies and have experience building scalable applications.",
    skills: ["JavaScript", "React", "Node.js", "System Design"],
    interests: [
      "Teaching",
      "Open Source",
      "Career Development",
      "System Architecture",
    ],
  });
});

export default viewRouter;
