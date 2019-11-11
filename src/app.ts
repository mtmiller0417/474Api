import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"

import connect from "./connect";
import { db } from "./config/config";
import * as UserController from "./controllers/UserController";

const app: Application = express();
const port: number = 5000 || process.env.PORT;
//const db: string = "mongodb://<username>:<password>@mongo.mlab.com:<port>/<database_name>"

connect(db);

// Define routers
const apiRoutes = express.Router(),
      userRoutes = express.Router(),
      groupRoutes = express.Router();

//Connect routers together
app.use('/api', apiRoutes);
apiRoutes.use('/users',userRoutes);
apiRoutes.use('/groups',groupRoutes);

// Change to app if broken below

// Add body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

apiRoutes.use(bodyParser.json());
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({ extended: true }));

// GET
userRoutes.get("/", UserController.allUsers); // /users
//userRoutes.get("/:id", UserController.showUser); // /users/:id
userRoutes.get("/user_id", UserController.showUser); // /users/:id

// POST
userRoutes.post("/", UserController.addUser); // /users

// PUT
userRoutes.patch("/:id", UserController.updateUser); // /:id

// DELETE
userRoutes.delete("/:id", UserController.deleteUser); // /:id
userRoutes.delete("/", UserController.deleteAll); // /users

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

