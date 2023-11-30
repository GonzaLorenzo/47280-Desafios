import userModel from "../models/users.models.js";
import mailingController from "./mail.controller.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import crypto from 'crypto';

export const postUser = async (req, res) => 
{
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
}

const recoveryLinks = {}

const recoveryPassword = async (req, res) =>
{
    const {email} = req.body;
    try
    {
        const user = await userModel.find({email: email})
        if (user)
        {
			const token = crypto.randomBytes(20).toString('hex')
			recoveryLinks[token] = {email, timestamp: Date.now()}
			const recoveryLink = `http://localhost:8080/api/users/resetpassword/${token}`
			mailingController.sendPasswordRecoveryEmail(email, recoveryLink)
			res.status(200).send('email sent successfully')
		}
        else
        {
			res.status(404).send({error: 'User not found'})
		}
	}
    catch (error)
    {
		res.status(500).send({error: `Error in sending recovery email ${error}`})
	}
}

const resetPassword = async (req, res) =>
{
	const { token } = req.params
	const linkData = recoveryLinks[token]
	const { newPassword } = req.body
	try
    {
		if (linkData && Date.now() - linkData.timestamp <= 3600000)
        {
			const { email } = linkData
			const user = await userModel.findOne({ email: email })
			const arePasswordsEqual = validatePassword(newPassword, user.password)
			if (!arePasswordsEqual)
            {
				const passwordHash = createHash(newPassword)
				await userModel.findOneAndUpdate({ email: email }, { password: passwordHash })
			}
            else
            {
				res.status(400).send('This password was previously used')
			}
			delete recoveryLinks[token]
			res.status(200).send('Your password has been changed successfully')
        }
        else
        {
			res.status(400).send('Invalid or expired token')
        }
	}
    catch (error)
    {
		res.status(500).send({ error: `Error trying to retrieve the password ${error}` })
	}
}

const usersController = { postUser, recoveryPassword, resetPassword }

export default usersController;