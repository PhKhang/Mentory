import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { engine } from "express-handlebars";
import { dashboard, getProfilePage } from "../controllers/userController";
import { search } from "../controllers/searchController";

const viewRouter = Router();

viewRouter.get("/", dashboard);

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
