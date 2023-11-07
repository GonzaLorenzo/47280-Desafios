import { Router } from "express";
import routerCart from "./carts.routes.js";
import routerProd from "./products.routes.js";
import routerSession from "./sessions.routes.js";
import routerUser from "./users.routes.js";
import routerMailing from "./mail.routes.js";
import routerTicket from "./tickets.routes.js";
import routerMock from "./mock.routes.js";

const router = Router()

router.use('/api/products', routerProd)
router.use('/api/users', routerUser)
router.use('/api/carts', routerCart)
router.use('/api/sessions', routerSession)
router.use('/api/mail', routerMailing)
router.use('/api/tickets', routerTicket)
router.use('/api/mockingproducts', routerMock)

export default router