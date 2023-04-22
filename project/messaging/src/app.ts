import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const aboutRouter = require("./routers/about");
const messageRouter = require("./routers/message");

app.use("/about", aboutRouter);
app.use("/message", messageRouter);

module.exports = app;
