import 'dotenv/config.js'
import nodemailer from 'nodemailer';
import { __dirname } from '../path.js';

let transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: 
        {
            user: 'gonzalodlorenzoprueba@gmail.com',
            pass: process.env.PASSWORD_EMAIL,
            authMethod: 'LOGIN',
        },
    }
)

const sendEmail = async (req, res) => 
{
	const resultado = await transporter.sendMail(
        {
            from: 'Backend47280Test gonzalodlorenzoprueba@gmail.com',
            to: 'gonzalodlorenzo@gmail.com',
            subject: 'nodemailerTest',
            html: 
            `
            <div>
                <h1>Probando</h1>
            </div>
            `,
            attachments: [
                {
                    filename: 'peacewalker.jpg',
                    path: __dirname + '/images/peacewalker.jpg',
                    cid: 'peacewalker.jpg',
                },
            ],
	    }
    )
	res.send({ message: 'Mail enviado', response: resultado })
}

const mailingController = { sendEmail }

export default mailingController