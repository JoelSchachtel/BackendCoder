import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport'
import initPassport from './config/passport.config.js'
import session from 'express-session';

import __dirname from './utils.js';
import run from './run.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const URI = 'mongodb+srv://admin:admin@cluster0.p4oohjo.mongodb.net/?retryWrites=true&w=majority';
const MongoDb = 'myFirstDatabase';

app.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        dbName: MongoDb
    }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());


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