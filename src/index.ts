import express, { Request, Response } from "express";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';

import apiRouter from "./routes/apiRoutes";
import viewRouter from "./routes/viewRoutes";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: "./src/views/layouts",
    partialsDir: "./src/views/partials",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      json: (context: any) => {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser());

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

app.use("/", viewRouter);
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
