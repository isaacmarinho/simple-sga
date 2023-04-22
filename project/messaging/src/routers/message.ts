import express from "express";

const messageRouter = express.Router();

const messageController = require("../controllers/messageController");

messageRouter.post("/", messageController.send);

module.exports = messageRouter;