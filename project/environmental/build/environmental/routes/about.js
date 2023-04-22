"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const properties = require("../package.json");
const aboutRoute = (0, express_1.Router)();
aboutRoute.get("/", (req, res) => {
    const aboutInfo = {
        name: properties.name,
        description: properties.description,
        author: properties.author
    };
    res.json(aboutInfo);
});
module.exports = aboutRoute;
