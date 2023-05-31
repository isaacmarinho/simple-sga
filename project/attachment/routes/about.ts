import {Request, Response, Router} from "express";

const properties = require("../package.json");

const aboutRoute = Router();

aboutRoute.get("/", (req: Request, res: Response) => {
    /*
     #swagger.path = '/about'
     #swagger.method = 'get'
     #swagger.description = 'Exibe informações sobre o microsserviço'
     #swagger.produces = ['application/json']
    */
    const aboutInfo = {
        name: properties.name,
        description: properties.description,
        author: properties.author
    }
    res.json(aboutInfo)
})

module.exports = aboutRoute