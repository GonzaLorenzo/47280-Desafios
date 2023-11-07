import { Router } from "express";
import mockController from "../controllers/mock.controller";
import { passportError, authorization } from "../utils/messageErrors";

const routerMock = Router()

routerMock.get('/', passportError('jwt'), authorization('admin'), mockController.createProducts)

export default routerMock;