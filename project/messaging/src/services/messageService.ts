import amqp, {Channel, Message} from "amqplib/callback_api"
import {ENVIRONMENTAL_QUEUE_NAME} from "../consts/constants";
import * as mailService from "./mailService";

const CONN_URL = "amqp://guest:guest@localhost:5672/";

let ch: Channel | null = null;

amqp.connect(CONN_URL, (err: any, conn) => {
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
                        try {
                            mailService.sendMail(mail);
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    ch?.ack(msg);
                } else {
                    console.log("No message.");
                }
            }, {noAck: false});
        });
    } else {
        console.log("Deu águia!");
        console.log({error: err});
    }

});

export const publishToQueue = async (queueName: string, data: any) => {
    ch?.sendToQueue(queueName, Buffer.from(data,"utf-8"), {persistent: true});
}

process.on("exit", (code) => {
    ch?.close((err: any) => {
        console.log("Closing rabbitmq channel");
        if (!!err) {
            console.error(err);
        }
    });
});