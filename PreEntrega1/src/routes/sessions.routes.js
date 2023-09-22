import { Router } from "express";
import userModel from "../models/users.models.js";

const routerSession = Router()

routerSession.post('/login', async(req, res) =>
{
    const {email, password} = req.body

    try
    {
        if(req.session.login)
        {
            res.status(200).send({resultado: 'Authorized', message: user})
        }

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') 
        {
			req.session.login = true;

			req.session.user = 
            {
				first_name: 'Admin',
				last_name: 'Coderhouse',
				age: 10,
				email: email,
				rol: 'admin',
			};
			res.redirect('/products');
			return;
		}

        const user = await userModel.find({email: email})
        
        if(user)
        {
            if(user.password === password)
            {
                req.session.login = true
                
                req.session.user = 
                {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    email: user.email,
                    role: user.role
                }

                res.redirect(200, '/products')
            }
            else
            {
                res.status(401).send({result: 'Unauthorized', message: user})
            }
        }
        else
        {
            res.status(404).send({result: 'Not Found', message: user})
        }
    }
    catch(error)
    {
        res.status(400).send({error: `Error al iniciar sesión: ${error}`})
    }
})

routerSession.post('/logout', (req, res) =>
{
    if(req.session.login)
    {
        req.session.destroy()
    }
    res.status(200).send({result: 'Login eliminado'})
})

export default routerSession