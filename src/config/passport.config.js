import passport from "passport";
import local from 'passport-local';
import UserModel from "../dao/models/user.model.js";
import userModel from '../dao/models/user.model.js';
import {createHash, isValidPassword} from '../utils.js';

const LocalStrategy = local.Strategy;
const initPassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body
        try {
            const user = await UserModel.findOne({email: username})
            if(user) {
                console.log('El usuario ya existe.');
                return done(null, false)
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, false)
        }catch (error) {
            return done('[LOCAL] Error al obtener usuario' + error)
        }
    }))
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try{
            const user = await UserModel.findOne({email: username})
            if(!user) {
                console.log('El usuario no existe');
                return done(null, user)
            }
            if(!isValidPassword(user,password)) return done(null, false)
            return done(null,user)
        } catch(error){}
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initPassport;