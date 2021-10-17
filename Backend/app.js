global.config = require("./config.json");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const vacationsController = require("./controllers-layer/vacations-controller");
const authController = require("./controllers-layer/auth-controller");
const socketHelper = require("./helpers/socket-helper");
// const expressRateLimit=require("express-rate-limit");

const server = express();

server.use(cors());

server.use(express.json());
server.use(fileUpload());
server.use("/api/vacations", vacationsController);
server.use("/api/auth", authController);

const expressListener = server.listen(3001, () => console.log("Listening..."));
socketHelper.init(expressListener);
