import amqp, {Channel, Message} from "amqplib/callback_api"
import {ENVIRONMENTAL_QUEUE_NAME} from "../consts/constants";
import * as mailService from "./mailService";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_SCHEMA = process.env.RABBITMQ_SCHEMA || "amqp";
const RABBITMQ_HOST = process.env.SERVER_NAME || "localhost";
const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT || "5672", 10);
const RABBITMQ_USER = process.env.RABBITMQ_USER || "quest";
const RABBITMQ_PASS = process.env.RABBITMQ_PASSWORD || "quest";

const RABBITMQ_URL = `${RABBITMQ_SCHEMA}://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/`;

let ch: Channel | null = null;

amqp.connect(RABBITMQ_URL, (err: any, conn) => {
    if (!!conn && !err) {
        conn.createChannel((err: any, channel) => {
            ch = channel;
            ch.consume(ENVIRONMENTAL_QUEUE_NAME, (msg: Message | null) => {
                if (!!msg) {
                    console.log("...");
                    const message = JSON.parse(msg?.content.toString());
                    console.log({Message: message});
                    message.recipients.forEach((recipient: string) => {
                        const mail = new mailService.Mail(recipient, message.body, "", message.subject);
                        mailService.sendMail(mail).then((value) => {
                            console.log("Message sent!");
                            console.log("Return value: ", value);
                        }).catch((err) => {
                            console.error(err);
                        });
                    });
                    ch?.ack(msg);
                } else {
                    console.warn("No message.");
                }
            }, {noAck: false});
        });
    } else {
        console.log("Deu águia!");
        console.log({error: err});
    }

});

export const publishToQueue = async (queueName: string, data: any) => {
    ch?.sendToQueue(queueName, Buffer.from(data, "utf-8"), {persistent: true});
}

process.on("exit", (code) => {
    ch?.close((err: any) => {
        console.log("Closing rabbitmq channel");
        if (!!err) {
            console.error(err);
        }
    });
});