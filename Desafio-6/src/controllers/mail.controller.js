import 'dotenv/config.js'
import nodemailer from 'nodemailer';
import { __dirname } from '../path.js';
import { logger } from '../utils/logger.js';

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

const sendPasswordRecoveryEmail = (email, recoveryLink) =>
{
	const mailOptions =
    {
		from: 'Backend47280Test gonzalodlorenzoprueba@gmail.com',
		to: email,
		subject: 'Restore password',
		html:
        `
        <div>
            <h1>Enter this link to restore your password</h1>
			<p>${recoveryLink}</p>
        </div>
        `,
	}
	transporter.sendMail(mailOptions, (error, info) =>
    {
		if (error)
        {
			logger.error(`[ERROR][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] An error has occurred: ${error.message}`)
		} 
        else
        {
			logger.info(`[INFO][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Email sent successfully`)
		}
	})
}

const mailingController = { sendEmail, sendPasswordRecoveryEmail }

export default mailingController