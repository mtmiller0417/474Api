import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"

import connect from "./connect";
import { db } from "./config/config";
import * as UserController from "./controllers/UserController";
import * as GroupController from "./controllers/GroupController";
import { requireAuth } from './security/passport'

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

groupRoutes.use(bodyParser.json());
groupRoutes.use(bodyParser.urlencoded({ extended: true }));

// GET
userRoutes.get("/", UserController.allUsers); 
userRoutes.get("/user_id", requireAuth, UserController.showUser);
userRoutes.get("/group_id", requireAuth, UserController.getGroupIDs);
groupRoutes.get("/", GroupController.allGroups);
groupRoutes.get("/group_id", GroupController.showGroup);

// POST
userRoutes.post("/", UserController.addUser); 
groupRoutes.post("/", GroupController.createGroup);
groupRoutes.post("/messages", GroupController.createMessage);
groupRoutes.post("/events", GroupController.createEvent);


// PUT
userRoutes.put("/user_id", requireAuth, UserController.updateUser);
groupRoutes.put("/message", GroupController.editMessage);
groupRoutes.put("/event", GroupController.editEvent);

// DELETE
userRoutes.delete("/user_id", UserController.deleteUser); // This function may need editing
userRoutes.delete("/", UserController.deleteAll); 
groupRoutes.delete("/group_id", GroupController.deleteGroup);
groupRoutes.delete("/event", GroupController.deleteEvent);


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

