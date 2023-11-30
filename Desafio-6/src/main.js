import 'dotenv/config'

import express from 'express'
import passport from 'passport';
import initializePassport from './config/passport.js';
import session from 'express-session';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars'
import router from './routes/index.routes.js';
import { __dirname } from './path.js'
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import path from 'path'
import productsModel from './models/products.models.js';
import userModel from './models/users.models.js';
import messageModel from './models/messages.models.js';
import { errorHandler } from './services/errors/enum.js';
import { addLogger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


const PORT = 8080
const app = express()

const swaggerOptions =
{
	definition:
    {
		openapi: '3.1.0',
		info:
        {
			title: 'Documentación del curso de Backend',
			description: 'API Coderhouse Backend',
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Server
const server = app.listen(PORT, () =>
{
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
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

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended: true}))
app.use(addLogger)

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

    socket.on('submitLogin', async (userData) =>
    {
        await userModel.create(userData)
    })

    socket.on('submitRegister', async (userData) =>
    {
        await userModel.create(userData)
    })
})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/static/login', express.static(path.join(__dirname, '/public')))

app.use('/', router)

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

app.get('/static/register', async(req, res) =>
{
    res.render("register",
    {
        rutaJS: "register",
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

app.use(errorHandler)
