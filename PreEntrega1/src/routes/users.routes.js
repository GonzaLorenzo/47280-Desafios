import { Router } from "express";
import userModel from "../models/users.models.js";

const routerUser = Router()

routerUser.post('/', async (req, res) => {
	const {first_name, last_name, email, age, password} = req.body
	try 
    {
		const user = await userModel.find({email: email })

		if (!user) 
        {
			const response = await userModel.create({first_name, last_name, email, age, password});
			res.status(200).send({result: 'Usuario creado', message: response })
		} else 
        {
			res.status(400).send({result: `Error al crear usuario`, message: 'Usuario existente'});
		}
	} catch (error) 
    {
		res.status(400).send({error: `Error al crear usuario: ${error}` })
	}
});

export default routerUser;