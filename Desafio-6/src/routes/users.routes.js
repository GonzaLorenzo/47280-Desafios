import { Router } from "express";
import passport from 'passport'
import { postUser } from "../controllers/users.controller.js";

const routerUser = Router()

routerUser.post('/', (req, res, next) =>
{
    const { first_name, last_name, email, age } = req.body

    try
    {
        if(!first_name || !last_name || !email || !age || !password)
        {
            CustomError.createError(
            {
                name: 'User creation error.',
                cause: generateUserErrorInfo(
                    {
                        first_name,
                        last_name,
                        email,
                        age,
                        password
                    }
                ),
                message: 'Error trying to create user.',
                code: EErrors.INVALID_USER_DATA
            })
        }
        next()
    }
    catch (error)
    {
        next(error)
    }
},passport.authenticate('register'), postUser)

export default routerUser