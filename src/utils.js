import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt, {hashSync} from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {PRIVATE_KEY, JWT_COOKIE_NAME} from './config/credentials.js'
// import { Strategy } from 'passport-github2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname

export const generateToken = user => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'});
    console.log(token);
    return token;
}

// Busca el token - controla existencia y autorizacion

export const authToken = (req, res, next) => {
    const token = req.cookies[JWT_COOKIE_NAME];

    if (!token) return res.status(401).render('errors/base', {error: 'Not Auth.'});

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).render('error/base', {error: 'Not authorized.'})

        req.user = credentials.user;
        next()
    })
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null;
}

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            console.log('passportCall: user: ', user);
            if (!user) {
                return res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
                //return next();
            };
            req.user = user;
            next();
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        const user = req.user.user;
        if (!user) return res.status(401).send({ error: "Unauthorized" });
        if (user.role != role) return res.status(403).send({ error: 'No Permission' })
        next();
    }
}

