import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"

import connect from "./connect";
import { db } from "./config/config";
import * as UserController from "./controllers/UserController";

const app: Application = express();
const port: number = 5000 || process.env.PORT;
//const db: string = "mongodb://<username>:<password>@mongo.mlab.com:<port>/<database_name>"

connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// What does this do???
/*
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World");
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", UserController.allUsers);

app.get("/users/:id", UserController.showUser);

app.post("/users", UserController.addUser);

app.patch("/users/:id", UserController.updateUser);

app.delete("/users/:id", UserController.deleteUser);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

