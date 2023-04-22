import {Request, Response} from "express";

const properties = require("../../package.json");

const aboutRoute = require("express").Router();

aboutRoute.get("/", (req: Request, res: Response) => {
    const aboutInfo = {
        name: properties.name,
        description: properties.description,
        author: properties.author
    }
    res.json(aboutInfo)
})

module.exports = aboutRoute