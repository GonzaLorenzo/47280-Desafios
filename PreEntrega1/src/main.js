import express from 'express'
import {engine} from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import ProductManager from './controllers/productManager.js';
import routerCart from './routes/carts.routes.js'
import { __dirname } from './path.js'
import {Server} from 'socket.io'
import path from 'path'

const PORT = 8080
const app = express()

const productManager = new ProductManager('src/models/products.json')

//Server
const server = app.listen(PORT, () =>
{
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Socket.io
io.on("connection", (socket) =>
{
    console.log("Conexion con Socket.io")
    socket.on('newProduct', (product) =>
    {
        productManager.addProduct(product)
        //io.emit('productUpdated');
    })
})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)

console.log(path.join(__dirname, '/public'))

app.get('/static', async(req, res) =>
{
    const prods = await productManager.getProducts()
    
    res.render("home", 
    {
        rutaCSS: "home",
        rutaJS: "home",
        products: prods
    })
})

app.get('/static/realTimeProducts', async(req, res) =>
{
    const prods = await productManager.getProducts()

    res.render("realTimeProducts",
    {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
        products: prods
    })
})

