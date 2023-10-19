import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";

const routerMessage = Router();

routerMessage.get('/', messagesController.getMessage)

routerMessage.post('/', messagesController.postMessage)

export default routerMessage