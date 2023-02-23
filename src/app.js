import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport'
import initPassport from './config/passport.config.js'
// OTHERS
import __dirname from './utils.js';
import run from './run.js';

const app = express();

// Transformamos la información recibida en JSON mediante un MIDDLEWARE
app.use(express.json());
// Permite recibir información desde la url por medio del body en formato JSON
app.use(express.urlencoded({extended: true}));
// Seteamos la carpeta public para la página
app.use(express.static(__dirname + '/public'));
// Utilizamos el engine para definir el motor de plantillas (Template engine) - En este caso handlebars
app.engine('handlebars', handlebars.engine());
// Seteamos la carpeta views
app.set('views', __dirname + '/views');
// Terminamos de definir la vista - handlebars
app.set('view engine', 'handlebars');
app.use(cookieParser('WSPcookieToken'))

// Mongoose config
const URI = 'mongodb+srv://admin:admin@cluster0.p4oohjo.mongodb.net/?retryWrites=true&w=majority';
const MongoDb = 'myFirstDatabase';

app.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        dbName: MongoDb,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }),
    secret: 'mysecret',
    resave: true, //Mantiene la session activa
    saveUninitialized: true //Guardado de variables así estén vacías
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false)


const env = () => {
    mongoose.connect(URI, {dbName: MongoDb}, (error) => {
        if(error){
            console.log('Error to connect with DB...');
            return
        }
        const httpServer = app.listen(8080, () => console.log('Listening..'))
        const socketServer = new Server(httpServer);
        httpServer.on('error', (e) => console.log('ERROR' + e))
        run(socketServer, app)
    });
}

env();