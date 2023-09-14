import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose';
import {engine} from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'
import { __dirname } from './path.js'
import {Server} from 'socket.io'
import path from 'path'
import productsModel from './models/products.models.js';
import cartModel from './models/carts.models.js';

const PORT = 8080
const app = express()

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

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("BDD conectada"))
.catch((error => console.log("Error en conexion con MongoDB ATLAS: ", error)))

//Socket.io
io.on("connection", (socket) =>
{
    console.log("Conexion con Socket.io")
    socket.on('newProduct', async (product) =>
    {
        await productsModel.create(product)
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
    res.render("home", 
    {
        rutaCSS: "home",
        rutaJS: "home",
    })
})

app.get('/static/realTimeProducts', async(req, res) =>
{
    res.render("realTimeProducts",
    {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts",
    })
})

