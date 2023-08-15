import express from 'express'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/carts.routes.js'
import { __dirname } from './path.js'
import path from 'path'

const PORT = 8080
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)

console.log(path.join(__dirname, '/public'))

//Server
app.listen(PORT, () =>
{
    console.log(`Server on port ${PORT}`)
})