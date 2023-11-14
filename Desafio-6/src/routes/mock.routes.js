import { Router } from "express";
import mockController from "../controllers/mock.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";

const routerMock = Router()

routerMock.get('/', passportError('jwt'), authorization('admin'), mockController.createProducts)

export default routerMock;