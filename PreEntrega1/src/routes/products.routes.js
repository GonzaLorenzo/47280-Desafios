import { Router } from 'express'
import ProductManager from '../controllers/productManager.js';

const productManager = new ProductManager('src/models/products.json')

const routerProd = Router();

routerProd.get('/', async(req,res) =>
{
    const {limit} = req.query

    const products = await productManager.getProducts(limit)

    res.status(200).send(products)
});

routerProd.get('/:id', async(req, res) =>
{
    const {id} = req.params
    const prod = await productManager.getProductByID(parseInt(id))

    if(prod)
    {
        res.status(200).send(prod)
    }
    else
    {
        res.status(404).send("No existe.")
    }
});

routerProd.post('/', async(req, res) =>
{
    const conf = await productManager.addProduct(req.body)
    if(conf)
    {
        res.status(200).send("Creado correctamente.")
    }
    else
    {
        res.status(400).send("Ya existente.")
    }
});


routerProd.put('/:id', async(req, res) =>
{
    const conf = await productManager.updateProduct(req.params.id, req.body)
    if(conf)
    {
        res.status(200).send("Actualizado correctamente.")
    }
    else
    {
        res.status(404).send("No encontrado.")
    }
});


routerProd.delete('/:id', async(req, res) =>
{
    const conf = await productManager.deleteProduct(req.params.id)
    if(conf)
    {
        res.status(200).send("Eliminado correctamente.")
    }
    else
    {
        res.status(404).send("No encontrado.")
    }
});

export default routerProd;