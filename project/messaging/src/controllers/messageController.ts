import {Request, Response} from "express";
import {publishToQueue} from "../services/messageService";

exports.send = async (req: Request, res: Response) => {
    try {
        console.log("Body",req.body);
        const {queueName, payload} = req.body;
        console.log("queueName",queueName);
        console.log("payload", JSON.stringify(payload));
        await publishToQueue(queueName, JSON.stringify(payload));
        res.status(200).send({status: true, response: {"message-sent": true}});
    } catch (error) {
        res.status(500).json({error: error});
    }
}