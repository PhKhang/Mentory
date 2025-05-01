import { Request, Response, Router } from "express";
import { auth } from "../config/firebase";
import { engine } from "express-handlebars";

const viewRouter = Router();

viewRouter.get("/", (req: Request, res: Response) => {
  const user = auth.currentUser;
  // return res.render("home", {});
  if (user) {
    res.send(`Hello ${user.email}`);
  } else {
    res.send("Hello Guest");
  }
});

viewRouter.get("/login", (req: Request, res: Response) => {
  return res.render("login", {});
});
  

viewRouter.get("/register", (req: Request, res: Response) => {
  return res.render("register", {});
  
  res.send(`
       <button id="loginBtn">Register</button>
  
    <script>
      document.getElementById('loginBtn').addEventListener('click', async () => {
        try {
          const res = await fetch('api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'trannguyenphuckhang12@gmail.com', password: 'Password1234' })
          });
  
          const data = await res.json();
          alert(data);  // Display the response message
        } catch (error) {
          alert('Login failed!');
        }
      });
    </script>
      `);
});

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

export default viewRouter;
