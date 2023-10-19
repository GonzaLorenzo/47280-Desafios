import messageModel from "../models/messages.models.js";

const getMessage = async (req, res) => 
{
	try 
    {
		const foundMessage = await messageModel.find()
		res.status(200).send({ resultado: 'OK', message: foundMessage })
	} 
    catch (error) 
    {
		res.status(400).send({ error: `Error al consultar mensajes: ${error}` })
	}
}

const postMessage = async (req, res) => 
{
	const { email, message } = req.body

	try 
    {
		const respuesta = await messageModel.create(
        {
			email,
			message,
		})
        
		res.status(200).send({ resultado: 'OK', message: respuesta })
	} 
    catch (error)
    {
		res.status(400).send({ error: `Error al crear producto: ${error}` })
	}
}

const messagesController = 
{
	postMessage,
	getMessage,
}

export default messagesController