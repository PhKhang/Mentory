import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./config/firebase";

import apiRouter from "./routes/apiRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

app.get("/", (req: Request, res: Response) => {
  const user = auth.currentUser;
  if (user) {
    res.send(`Hello ${user.email}`);
  } else {
    res.send("Hello Guest");
  }
});

app.get("/register", (req: Request, res: Response) => {
  //   const { email, password } = req.body;
  const { email, password } = {
    email: "",
    password: "",
  };
  res.send(`
     <button id="loginBtn">Login</button>

  <script>
    document.getElementById('loginBtn').addEventListener('click', async () => {
      try {
        const res = await fetch('api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
        });

        const data = await res.json();
        alert(data.message);  // Display the response message
      } catch (error) {
        alert('Login failed!');
      }
    });
  </script>
    `);
});

app.get("/logout", (req: Request, res: Response) => {
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

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
