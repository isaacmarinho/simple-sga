import express from "express";

const coreRouter = express.Router();

const coreController = require("../controllers/coreController");

coreRouter.get("/process/", coreController.process);

module.exports = coreRouter;