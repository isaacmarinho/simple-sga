import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const aboutRouter = require("./routers/about");
const processesRouter = require("./routers/process");

app.use("/core/about", aboutRouter);
app.use("/core/process", processesRouter);

module.exports = app;
