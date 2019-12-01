import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"

import connect from "./connect";
import { db } from "./config/config";
import * as UserController from "./controllers/UserController";
import * as GroupController from "./controllers/GroupController";
import { requireAuth } from './security/passport'

var cors = require('cors');

const app: Application = express();
const port: number = 5000 || process.env.PORT;
//const db: string = "mongodb://<username>:<password>@mongo.mlab.com:<port>/<database_name>"
app.use(cors());
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
userRoutes.get("/group_id", requireAuth, UserController.getGroupIDs);
groupRoutes.get("/", GroupController.allGroups);
groupRoutes.get("/group_id", requireAuth, GroupController.showGroup);

// POST
userRoutes.post("/", UserController.addUser); 
userRoutes.post("/user_id", UserController.showUser);
groupRoutes.post("/", requireAuth, GroupController.createGroup);
groupRoutes.post("/messages", requireAuth, GroupController.createMessage);
groupRoutes.post("/events", requireAuth, GroupController.createEvent);


// PUT
userRoutes.put("/user_id", requireAuth, UserController.updateUser);
groupRoutes.put("/", requireAuth, GroupController.editGroup);
groupRoutes.put("/message", requireAuth, GroupController.editMessage);
groupRoutes.put("/event", requireAuth, GroupController.editEvent);

// DELETE
userRoutes.delete("/user_id", UserController.deleteUser); // This function may need editing
userRoutes.delete("/", UserController.deleteAll); 
groupRoutes.delete("/group_id", requireAuth, GroupController.deleteGroup);
groupRoutes.delete("/event", requireAuth, GroupController.deleteEvent);
groupRoutes.delete("/", GroupController.deleteAllGroups);


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

