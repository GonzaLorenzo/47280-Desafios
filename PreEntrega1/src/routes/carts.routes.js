import { Router } from 'express'
import CartManager from '../controllers/cartManager.js';

const cartManager = new CartManager('src/models/carts.json')
const routerCart = Router()

routerCart.post('/', async(req, res) =>
{
    const conf = await cartManager.createCart();
    if(conf)
    {
        res.status(200).send("Creado correctamente.")
    }
    else
    {
        res.status(400).send("Ya existente.")
    }
})

routerCart.get('/:cid', async(req, res) =>
{
    const {cid} = req.params

    const products = await cartManager.getProductsInCart(parseInt(cid))
    res.status(200).send(products)
})

routerCart.post('/:cid/product/:pid', async(req, res) =>
{
    const conf = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    if(conf)
    {
        res.status(200).send("Agregado correctamente.")
    }
    else
    {
        res.status(400).send("Error al agregar el producto al carrito.")
    }
})

export default routerCart;