import userModel from "../models/users.models.js";

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