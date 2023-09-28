import { Router } from "express";
import passport from 'passport'
import { createHash } from "../utils/bcrypt.js";
import userModel from "../models/users.models.js";

const routerUser = Router()

/* const {first_name, last_name, email, age, password} = req.body
	try 
    {
		const user = await userModel.find({email: email })

		if (!user) 
        {
			const hashPassword = createHash(password)

			const response = await userModel.create(
				{
					first_name: first_name,
					last_name: last_name,
					age: age,
					email: email,
					password: hashPassword
				}
			);
			res.status(200).send({result: 'Usuario creado', message: response })
		} else 
        {
			res.status(400).send({result: `Error al crear usuario`, message: 'Usuario existente'});
		}
	} catch (error) 
    {
		res.status(400).send({error: `Error al crear usuario: ${error}` })
	} */

routerUser.post('/', passport.authenticate('register'), async (req, res) => {
	try
	{
		if(!req.user)
		{
			return res.status(400).send({mensaje: 'Usuario existente'})
		}

		return res.status(200).send({mensaje: 'Usuario creado'})
	}
	catch(error)
	{
		res.status(500).send({mensaje: `Error al crear usuario ${error}`})
	}
});

export default routerUser;