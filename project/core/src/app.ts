import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const aboutRouter = require("./routers/about");
const coreRouter = require("./routers/core");

app.use("/about", aboutRouter);
app.use("/core", coreRouter);

module.exports = app;
