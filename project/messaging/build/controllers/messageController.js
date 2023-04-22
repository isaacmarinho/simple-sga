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
Object.defineProperty(exports, "__esModule", { value: true });
const messageService_1 = require("../services/messageService");
exports.send = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { queueName, payload } = req.body;
        yield (0, messageService_1.publishToQueue)(queueName, payload);
        res.status(200).send({ status: true, response: { "message-sent": true } });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
