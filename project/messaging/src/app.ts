import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const aboutRouter = require("./routers/about");
const messageRouter = require("./routers/message");

app.use("/messaging/about", aboutRouter);
app.use("/messaging/message", messageRouter);

module.exports = app;
