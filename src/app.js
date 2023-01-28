import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import mongoose from 'mongoose';
// import productRouter from './routes/products.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

mongoose.connect("mongodb+srv://admin:admin@cluster0.p4oohjo.mongodb.net/?retryWrites=true&w=majority", {
    dbName: "ecommerce"
}, (error) => {
    if(error) {
        console.log('DB no conected...');
        return
    };
    const httpServer = app.listen(8080, () => console.log('Listening in port 8080...'));
    const socketServer = new Server(httpServer);
    httpServer.on('error', () => console.log('error'));
    return(socketServer, app)
})