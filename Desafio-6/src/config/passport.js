import local from 'passport-local'
import passport from 'passport'
import jwt from 'passport-jwt'
import GithubStrategy from 'passport-github2'
import userModel from '../models/users.models.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () =>
{
    const cookieExtractor = req => 
    {
        console.log(req.cookies)

        const token = req.cookies ? req.cookies.jwtCookie : {}
        console.log(token)
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) =>
    {
        try
        {
            return done(null, jwt_payload)
        }
        catch(error)
        {
            return done(error)
        }
    }))

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) =>{
            const {first_name, last_name, email, age} = req.body

            try
            {
                const user = await userModel.findOne({ email:username })

                //Ya existe el usuario
                if(user)
                {
                    return done(null, false)
                }
                const hashPassword = createHash(password)
                const createdUser = await userModel.create(
                    {
                        first_name: first_name,
                        last_name: last_name,
                        age: age,
                        email: email,
                        password: hashPassword
                    }
                )
                return done(null, createdUser)
            }
            catch (error)
            {
                return done(error)
            }
        }
        
    ))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done) =>{
        try
        {
            const user = await userModel.findOne({email: username})
            
            //No existe el usuario
            if(!user)
            {
                return done(null, false)
            }
            
            //Usuario y contraseña validos
            if(validatePassword(password, user.password))
            {
                return done(null, user)
            }

            //Contraseña no valida
            return done(null, false)
        }
        catch(error)
        {
            return done(error)
        }
    }))

    passport.use('github', new GithubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done) =>{
            
            try
            {
                console.log(accessToken)
                console.log(refreshToken)
                const user = await userModel.findOne({email: profile._json.email})

                if(user)
                {
                    done(null, false)
                }
                else
                {
                    const createdUser = await userModel.create({
                        first_name: profile._json.name,
                        last_name: ' ',
                        age: 18,
                        email: profile._json.email,
                        password: 'password'
                    })
    
                    done(null, createdUser)
                }
            }
            catch(error)
            {
                done(error)
            }
        }
    ))

    passport.serializeUser((user, done) =>
    {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) =>
    {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport