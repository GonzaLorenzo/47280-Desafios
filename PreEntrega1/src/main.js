import 'dotenv/config'

import express from 'express'
import session from 'express-session';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'
import routerUser from './routes/users.routes.js';
import routerSession from './routes/sessions.routes.js';
import { __dirname } from './path.js'
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
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
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(session(
    {
        store: MongoStore.create(
            {
                mongoUrl: process.env.MONGO_URL,
                mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
                ttl: 120
            }
        ),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }
))

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

    socket.on('submit login', async user => 
    {
		const { email } = user;
	});
})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)
app.use('/api/users', routerUser)
app.use('/api/sessions', routerSession)

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

app.get('/static/products', async(req, res) =>
{
    res.render("products",
    {
        rutaJS: "products",
    })
})

app.get('/static/login', async(req, res) =>
{
    res.render("login",
    {
        rutaJS: "login",
    })
})

//Cookies

app.get('/setCookie', (req, res) =>
{
    res.cookie()
})

app.get('/getCookie', (req, res) =>
{
    res.send(req.signedCookies)
})

//Sessions

app.get('/login', (req, res) =>
{
    const {email, password} = req.body

    req.session.email = email
    req.session.password = password

    return res.send("Usuario logueado")
})

app.get('/logout', (req, send) =>
{
    req.session.destroy(() =>
    {
        res.send("Salió de la sesión.")
    })
})
