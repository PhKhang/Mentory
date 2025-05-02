import { Request, Response, Router } from "express";
import { auth } from "../config/firebase";
import { engine } from "express-handlebars";
import { getProfilePage } from "../controllers/userController";
import { search } from "../controllers/searchController";

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

viewRouter.get("/profile/:id", getProfilePage);
viewRouter.get("/profile", getProfilePage);

viewRouter.get("/browse", search);

export default viewRouter;
