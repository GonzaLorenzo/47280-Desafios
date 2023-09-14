import { Router } from 'express'
import cartModel from '../models/carts.models.js';

const routerCart = Router()

routerCart.get('/', async (req, res) =>
{
    const {limit} = req.query

    try
    {
        const carts = await cartModel.find().limit(limit)

        res.status(200).send({result: 'OK', message: carts})
    }
    catch(error)
    {
        res.status(400).send({error: `Error al consultar carritos: ${error}`})
    }
})

routerCart.get('/:cid', async (req, res) =>
{
    const {cid} = req.params

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            res.status(200).send({result: 'OK', message: cart})
        }
        else
        {
            res.status(404).send({result: 'Not Found', message: cart})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al consultar el carrito: ${error}`})
    }
})

routerCart.post('/', async (req, res) =>
{
    try
    {
        const newCart = await cartModel.create({})

        res.status(200).send({result: 'OK', message: newCart})
    }
    catch(error)
    {
        res.status(400).send({error: `Error al crear el carrito: ${error}`})
    }
})

routerCart.post('/:cid/products/:pid', async (req, res) =>
{
    const {cid} = req.params
    const {pid} = req.params
    const {prodQuantity} = req.body

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            const prod = cart.products.find(product => product.id_prod.equals(pid))

            if(prod)
            {
                prod.quantity += prodQuantity    
            }
            else
            {
                cart.products.push({id_prod: pid, quantity: prodQuantity})
            }

            const newCart = await cart.save()
            res.status(200).send({result: 'OK', message: 'El producto fue añadido al carrito', cart: newCart})
        }
        else
        {
            res.status(404).send({result: 'Not Found'})
        }  
    }
    catch(error)
    {
        res.status(400).send({error: `Error al añadir el producto al carrito: ${error}`})
    }
})

routerCart.put('/:cid', async (req, res) =>
{
    const {cid} = req.params
    const {products} = req.body

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            products.forEach(product => 
            {
                const prod = cart.products.find(cartProd => cartProd.id_prod.equals(product.id_prod))
                if(prod)
                {
                    prod.quantity += product.quantity
                }
                else
                {
                    cart.products.push(product)
                }
            })

            const newCart = await cart.save()
            res.status(200).send({result: 'OK', message: 'El carrito fue actualizado', cart: newCart})
        }
        else
        {
            res.status(404).send({result: 'Not Found'})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al actualizar el carrito: ${error}`})
    }
})

routerCart.put('/:cid/products/:pid', async (req, res) =>
{
    const {cid} = req.params
    const {pid} = req.params
    const {quantity} = req.body

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            const prod = cart.products.find(prod => prod.id_prod.equals(pid))

            if(prod)
            {
                prod.quantity += quantity
            }
            else
            {
                res.status(404).send({result: 'Not Found'})
                return;
            }

            const newCart = await cart.save()
            res.status(200).send({result: 'OK', message: 'El carrito fue actualizado', cart: newCart})
        }
        else
        {
            res.status(404).send({result: 'Not Found'})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al actualizar el carrito: ${error}`})
    }
})

routerCart.delete('/:cid/products/:pid', async (req, res) =>
{
    const {cid} = req.params
    const {pid} = req.params

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            const index = cart.products.findIndex(product => product.id_prod._id.equals(pid))

            if(index !== -1)
            {
                cart.products.splice(index, 1)

                const newCart = await cart.save()
                res.status(200).send({result: 'OK', message: 'Producto eliminado del carrito', cart: newCart})
            }
            else
            {
                res.status(404).send({result: 'Not Found'})
            }
        }
        else
        {
            res.status(404).send({result: 'Not Found'})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al eliminar el producto del carrito: ${error}`})
    }
})

routerCart.delete('/:cid', async (req, res) =>
{
    const {cid} = req.params

    try
    {
        const cart = await cartModel.findById(cid)

        if(cart)
        {
            cart.products = []
            const newCart = await cart.save()
            res.status(200).send({result: 'OK', message: 'Se han eliminado todos los productos del carrito', cart: newCart})
        }
        else
        {
            res.status(404).send({result: 'Not Found'})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al eliminar todos los productos del carrito: ${error}`})
    }
})

export default routerCart;