import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"

import connect from "./connect";
import { db } from "./config/config";
import * as UserController from "./controllers/UserController";
import * as GroupController from "./controllers/GroupController";
import { requireAuth } from './security/passport'
import { ChatServer } from './chat-server';

const app: Application = express();
const port: number = 5000 || process.env.PORT;
//const db: string = "mongodb://<username>:<password>@mongo.mlab.com:<port>/<database_name>"

connect(db);

//sets up socket.io for chat
const http = require("http").Server(app);
const io = require("socket.io");
const socket = io(http);

//setup event listener
socket.on("connection", (socket:any) => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});




// Define routers
const apiRoutes = express.Router(),
      userRoutes = express.Router(),
      groupRoutes = express.Router();

//enable CORS
// apiRoutes.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4300"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

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
userRoutes.get("/user_id", UserController.showUser);
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
groupRoutes.delete("/", GroupController.deleteAllGroups);



let chatApp = new ChatServer().getApp();
export { chatApp };

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

