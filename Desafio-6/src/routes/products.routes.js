import { Router } from 'express'
import productsModel from '../models/products.models.js';

const routerProd = Router();

routerProd.get('/', async (req, res) => 
{
    const {limit, page, sort, category, status} = req.query

    let sortOption;
	sort == 'asc' && (sortOption = 'price');
	sort == 'desc' && (sortOption = '-price');

    const options = 
    {
		limit: limit || 10,
		page: page || 1,
		sort: sortOption || null,
	};

    const query = {};
	category && (query.category = category);
	status && (query.status = status);

    try 
    {
		const prods = await productsModel.paginate(query, options);

		res.status(200).send({ resultado: 'OK', message: prods });
	} 
    catch (error) 
    {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
})

routerProd.get('/:pid', async (req, res) => 
{
    const {pid} = req.params
    try
    {
        const prod = await productsModel.findById(pid)
        if(prod)
        {
            res.status(200).send({result: 'OK', message: prod})
        }
        else
        {
            res.status(404).send({result: 'Not Found', message: prod})
        }        
    }
    catch (error)
    {
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

routerProd.post('/', async (req, res) => 
{
    const {title, description, stock, code, price, category} = req.body

    try
    {
        const response = await productsModel.create(
            {
                title, description, stock, code, price, category
            }
        )
        if(response)
        {
            res.status(200).send({result: 'OK', message: response})
        }
    }
    catch (error)
    {
        res.status(400).send({error: `Error al crear producto: ${error}`})
    }
})

routerProd.put('/:pid', async (req, res) => 
{
    const {pid} = req.params
    const {title, description, stock, code, price, category, status} = req.body

    try
    {
        const response = await productsModel.findByIdAndUpdate(pid, {title, description, stock, code, price, category, status})
        if(response)
        {
            res.status(200).send({result: 'OK', message: response})
        }
        else
        {
            res.status(404).send({result: 'Not Found', message: response})
        } 
    }
    catch (error)
    {
        res.status(400).send({error: `Error al actualizar producto: ${error}`})
    }
})

routerProd.delete('/:pid', async (req, res) => 
{
    const {pid} = req.params

    try
    {
        const response = await productsModel.findByIdAndDelete(pid)
        if(response)
        {
            res.status(200).send({result: 'OK', message: response})
        }
        else
        {
            res.status(404).send({result: 'Not Found', message: response})
        } 
    }
    catch (error)
    {
        res.status(400).send({error: `Error al eliminar producto: ${error}`})
    }
})

export default routerProd;