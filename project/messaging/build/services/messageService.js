"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToQueue = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const constants_1 = require("../consts/constants");
const CONN_URL = "amqp://localhost";
let ch = null;
callback_api_1.default.connect(CONN_URL, (err, conn) => {
    conn.createChannel((err, channel) => {
        ch = channel;
        ch.consume(constants_1.ENVIRONMENTAL_QUEUE_NAME, (msg) => {
            if (!!msg) {
                console.log("...");
                console.log({ Message: msg === null || msg === void 0 ? void 0 : msg.content.toString() });
                ch === null || ch === void 0 ? void 0 : ch.ack(msg);
            }
            else {
                console.log("No message.");
            }
        });
    });
});
const publishToQueue = (queueName, data) => __awaiter(void 0, void 0, void 0, function* () {
    ch === null || ch === void 0 ? void 0 : ch.sendToQueue(queueName, Buffer.from(data), { persistent: true });
});
exports.publishToQueue = publishToQueue;
process.on("exit", (code) => {
    ch === null || ch === void 0 ? void 0 : ch.close((err) => {
        console.log("Closing rabbitmq channel");
        if (!!err) {
            console.error(err);
        }
    });
});
