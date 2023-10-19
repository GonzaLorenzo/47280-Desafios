import { Router } from "express";
import routerCart from "./carts.routes.js";
import routerProd from "./products.routes.js";
import routerSession from "./sessions.routes.js";
import routerUser from "./users.routes.js";

const router = Router()

router.use('/api/products', routerProd)
router.use('/api/users', routerUser)
router.use('/api/carts', routerCart)
router.use('/api/sessions', routerSession)

export default router