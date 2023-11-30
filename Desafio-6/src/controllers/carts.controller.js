import cartModel from "../models/carts.models.js";
import productsModel from "../models/products.models.js";
import userModel from "../models/users.models.js";

const getCarts = async (req, res) => 
{
	const { limit } = req.query
	try 
    {
		const carts = await cartModel.find().limit(limit)
		if (carts)
		{
			res.status(200).send({ resultado: 'OK', message: carts });
		}
		else
		{
			res.status(404).send({ resultado: 'Carritos no encontrados' });
		}
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al consultar carritos: ${error}` })
	}
}

const getCart = async (req, res) => 
{
	const { cid } = req.params
	try 
    {
		const cart = await cartModel.findById(cid)
		if(cart)
        {
            res.status(200).send({ resultado: 'OK', message: cart })
        }
        else
        {
            res.status(404).send({ resultado: 'Not Found', message: cart })
        }
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al consultar carrito: ${error}` })
	}
}

const postCart = async (req, res) => 
{
	try 
    {
		const respuesta = await cartModel.create({})
		res.status(200).send({ resultado: 'OK', message: respuesta })
	} 
    catch (error) 
    {
		res.status(400).send({ error: `Error al crear carrito: ${error}` })
	}
}

const putProductToCart = async (req, res) => 
{
	const { cid, pid } = req.params
	console.log(cid, pid)

	try
    {
		const cart = await cartModel.findById(cid)
		const product = await productsModel.findById(pid)

		if (!product) 
        {
			res.status(404).send({ resultado: 'Product Not Found', message: product })
			return false
		}

		if (product.stock === 0) 
		{
			console.log(product.stock);
			res.status(400).send({ error: 'No hay stock' });
		}

		if (cart) 
        {
			const productExists = cart.products.find(prod => prod.id_prod == pid)

            if (!productExists) 
			{
				cart.products.push({ id_prod: product._id, quantity: 1 })
			} 
			else if (productExists.quantity < product.stock) 
			{
				productExists.quantity++
			} 
			else 
			{
				return res.status(400).send({ error: 'No hay stock' })
			}

			await cart.save()
			res.status(200).send({ resultado: 'OK', message: cart })
		}
        else 
        {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart })
		}
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al crear producto: ${error}` })
	}
}

const putQuantity = async (req, res) => 
{
	const { cid, pid } = req.params
	const { quantity } = req.body

	const product = await productModel.findById(pid);

	if (product.stock < productExists.quantity + quantity) 
	{
		res.status(400).send({ error: 'No hay stock' })
	}

	try 
    {
		const cart = await cartModel.findById(cid)

		if (cart) 
        {
			const productExists = cart.products.find(prod => prod.id_prod == pid)
			if (productExists) 
            {
				productExists.quantity += quantity
			} else 
            {
				res.status(404).send({ resultado: 'Product Not Found', message: cart })
				return
			}
			await cart.save()
			res.status(200).send({ resultado: 'OK', message: cart })
		} 
        else 
        {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart })
		}
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al agregar productos: ${error}` })
	}
}

const putProductsToCart = async (req, res) => 
{
	const { cid } = req.params;
	const { updatedProducts } = req.body;

	try 
    {
		const cart = await cartModel.findById(cid)
		
		updatedProducts.forEach(prod => 
		{
			const productExists = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod)

			if (productExists) 
			{
				productExists.quantity += prod.quantity
			} 
			else 
			{
				cart.products.push(prod)
			}
		})

		await cart.save();
		if(cart)
		{
			res.status(200).send({ resultado: 'OK', message: cart })
		}
		else
		{
			res.status(404).send({ resultado: 'Not Found', message: cart })
		}
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al agregar productos: ${error}` })
	}
}

const deleteCart = async (req, res) => 
{
	const { cid } = req.params
	try 
    {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] })
		if(cart)
        {
            res.status(200).send({ resultado: 'OK', message: cart })
        }
        else
        {
            res.status(404).send({ resultado: 'Not Found', message: cart })
        }
	} 
    catch (error) 
    {
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` })
	}
}

const deleteProductFromCart = async (req, res) => 
{
	const { cid, pid } = req.params

	try 
    {
		const cart = await cartModel.findById(cid)
		if (cart) 
        {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid)
			let deletedProduct
			if (productIndex !== -1) 
            {
				deletedProduct = cart.products[productIndex]
				cart.products.splice(productIndex, 1)
			} 
            else 
            {
				res.status(404).send({ resultado: 'Product Not Found', message: cart })
				return
			}
			await cart.save()
			res.status(200).send({ resultado: 'OK', message: deletedProduct })
		} 
        else 
        {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart })
		}
	} 
    catch (error) 
    {
		res.status(500).send({ error: `Error al eliminar producto: ${error}` })
	}
}

const purchaseCart = async (req, res) => 
{
	const { cid } = req.params
	try
	{
		const cart = await cartModel.findById(cid)
		const products = await productModel.find()

		if (cart)
		{
			const user = await userModel.find({ cart: cart._id })
			const email = user[0].email
			let amount = 0
			const purchasedItems = []
			cart.products.forEach(async item => 
				{
					const product = products.find(prod => prod._id == item.id_prod.toString())
					if (product.stock >= item.quantity) 
					{
						amount += product.price * item.quantity
						product.stock -= item.quantity
						await product.save()
						purchasedItems.push(product.title)
					}
				}
			)
			if (user.role === 'premium')
			{
				amount *= 0.9
			}
			await cartModel.findByIdAndUpdate(cid, { products: [] })
			res.redirect(`/api/tickets/create?amount=${amount}&email=${email}`)
		} else {
			res.status(404).send({ resultado: 'Not Found', message: cart })
		}
	}
	catch (error) 
	{
		res.status(500).send({ error: `Error al consultar carrito: ${error}`})
	}
}


const cartsController = 
{
	getCarts,
	getCart,
	postCart,
	putProductsToCart,
	putProductToCart,
	putQuantity,
	deleteCart,
	deleteProductFromCart,
	purchaseCart
}

export default cartsController