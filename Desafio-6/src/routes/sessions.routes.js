import { Router } from "express";
import userModel from "../models/users.models.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from 'passport';

const routerSession = Router()

/* const {email, password} = req.body

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
            if(validatePassword(password, user.password))
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
    } */

routerSession.post('/login', passport.authenticate('login'), async(req, res) =>
{
    try
    {
        if(!req.user)
        {
            return res.status(401).send({mensaje: "Invalidate user"})
        }

        req.session.user =
        {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({payload: req.user})
    }
    catch(error)
    {
        res.status(500).send({mensaje: `Error al iniciar sesion: ${error}`})
    }
})

routerSession.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) =>
{
    res.status(200).send({mensaje: 'Usuario creado'})
})

routerSession.get('/githubSession', passport.authenticate('github'), async (req, res) =>
{
    req.session.user = req.user
    res.status(200).send({mensaje: 'Session creada'})
})

routerSession.post('/logout', (req, res) =>
{
    // if(req.session.login)
    {
        req.session.destroy()
    }
    res.status(200).send({result: 'Login eliminado'})
})

export default routerSession