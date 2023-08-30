import express from "express";
import mongoose from "mongoose";
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.js';
import { Server } from 'socket.io';
import ProductManager from "./ProductManager.js";
import { getid } from "./ProductManager.js";
import Prouter from "./routes/Prouter.js";
import Crouter from "./routes/Crouter.js";
import __dirname from "./utils.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
const app = express();

const fileStorage = FileStore(session)

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://matiasgajo:coderhouse123@coder.dn8j0vr.mongodb.net/Coder?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 500
    }),
    secret: 'esteesmisecret',
    resave: false,
    saveUninitialized: false,
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res ) => {
    req.session.user = 'admin';
    res.send('ok')
})

mongoose.connect('mongodb+srv://matiasgajo:coderhouse123@coder.dn8j0vr.mongodb.net/Coder?retryWrites=true&w=majority')
    .then(()=> console.log("Database Connected!"))
    .catch(err => console.log(err))


    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname + "/public"))
    
    app.engine("handlebars", handlebars.engine());
    
    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");
    

app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter);
app.use("/", viewsRouter)

app.use('/api/p', Prouter);
app.use('/api/c', Crouter);

const manager = new ProductManager()
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log('server iniciado')
})
httpServer.on('error', error => console.log(error))
export const socketServer = new Server(httpServer)

socketServer.on('connection', async socket => {
    console.log('Nuevo socket conectado');
    const products = await manager.getProducts()
    socketServer.emit('productList', products)
    socket.on('message', data => {
        socketServer.emit('log',data)
    })
    socket.on('product', async newProd => {
        newProd.id = getid();
        newProd.status = true;
        let newProduct = await manager.addProduct(newProd)
        const products = await manager.getProducts()
        socketServer.emit('productList', products)
    })
    socket.on('productDelete', async delProd => {
        let id = await manager.deleteProduct(delProd)
        const products = await manager.getProducts()
        socketServer.emit('productList', products)
    })
})
