import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const productManager = new ProductManager("./DesafioTres/src/products.txt");
const PORT = 4000

app.get('/products/:id', async (req, res) =>
{
    const prods = await productManager.getProductByID(req.params.id);
    //console.log(prods)
    res.send(prods)
})

app.get('/products', async (req, res) =>
{
    const {limit} = req.query
    const prods = await productManager.getProducts(limit);
    res.send(prods);
})

app.get('*', (req, res) =>
{
    res.send("Error 404")
})

app.listen(PORT, () =>
{
    console.log(`Server on port ${PORT}`)
})