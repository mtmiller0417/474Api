"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_1 = __importDefault(require("./connect"));
const config_1 = require("./config/config");
const UserController = __importStar(require("./controllers/UserController"));
const GroupController = __importStar(require("./controllers/GroupController"));
const passport_1 = require("./security/passport");
var cors = require('cors');
const app = express_1.default();
const port = 5000 || process.env.PORT;
//const db: string = "mongodb://<username>:<password>@mongo.mlab.com:<port>/<database_name>"
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
connect_1.default(config_1.db);
// Define routers
const apiRoutes = express_1.default.Router(), userRoutes = express_1.default.Router(), groupRoutes = express_1.default.Router();
//Connect routers together
app.use('/api', apiRoutes);
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/groups', groupRoutes);
// Change to app if broken below
// Add body parsers
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
apiRoutes.use(body_parser_1.default.json());
apiRoutes.use(body_parser_1.default.urlencoded({ extended: true }));
userRoutes.use(body_parser_1.default.json());
userRoutes.use(body_parser_1.default.urlencoded({ extended: true }));
groupRoutes.use(body_parser_1.default.json());
groupRoutes.use(body_parser_1.default.urlencoded({ extended: true }));
// GET
userRoutes.get("/", UserController.allUsers);
userRoutes.get("/group_id", passport_1.requireAuth, UserController.getGroupIDs);
groupRoutes.get("/", GroupController.allGroups);
groupRoutes.get("/group_id", passport_1.requireAuth, GroupController.showGroup);
// POST
userRoutes.post("/", UserController.addUser);
userRoutes.post("/user_id", UserController.showUser);
groupRoutes.post("/", passport_1.requireAuth, GroupController.createGroup);
groupRoutes.post("/messages", passport_1.requireAuth, GroupController.createMessage);
groupRoutes.post("/events", passport_1.requireAuth, GroupController.createEvent);
// PUT
userRoutes.put("/user_id", passport_1.requireAuth, UserController.updateUser);
groupRoutes.put("/", passport_1.requireAuth, GroupController.editGroup);
groupRoutes.put("/message", passport_1.requireAuth, GroupController.editMessage);
groupRoutes.put("/event", passport_1.requireAuth, GroupController.editEvent);
// DELETE
userRoutes.delete("/user_id", UserController.deleteUser); // This function may need editing
userRoutes.delete("/", UserController.deleteAll);
groupRoutes.delete("/group_id", passport_1.requireAuth, GroupController.deleteGroup);
groupRoutes.delete("/event", passport_1.requireAuth, GroupController.deleteEvent);
groupRoutes.delete("/", GroupController.deleteAllGroups);
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
//# sourceMappingURL=app.js.map