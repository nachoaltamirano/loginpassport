import { Router } from 'express';
import fs from 'fs';
import ProductManager from '../ProductManager.js';
import CManager from '../models/DAO/cartM.js';
import PManager from '../models/DAO/prodM.js';
import { Productsmodel } from '../models/prod.model.js';
import { socketServer } from '../app.js';
import UserManager from '../models/DAO/userM.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';
const viewsRouter = Router()
const manager = new ProductManager()
const cart = new CManager();
const prod = new PManager();
const userM = new UserManager()


viewsRouter.get('/', (req, res) => {
    const data = fs.readFileSync('carritos.json');
    const cart = JSON.parse(data)
    res.render('home', {cart})
})
viewsRouter.get("/products", async (req, res) => {
    const { page = 1, limit = 4 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await Productsmodel.paginate({}, { page, limit, lean: true });
    const productos = docs;
    res.render('home',
        {
            style: 'index.css',
            productos,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage
        });
})


viewsRouter.get("/realtimeproducts", async (req, res) => {
    const productos = await Productsmodel.find().lean();
    res.render('realTimeProducts',
        {
            style: 'index.css',
            productos
        });

})

viewsRouter.post('/realtimeproducts', async (req, res) => {
    let P = req.body;
    if (!P.title || !P.description || !P.code || !P.price || !P.stock || !P.category) {
        return  res.status(400).send({status: "error", error})
    }
    let producto = await prod.addP(P)
    res.send({status: "success", payload: producto})
    const productos = await prod.getP()
    socketServer.emit("newproduct", productos)
})

viewsRouter.delete('/realtimeproducts/:pid', async (req, res) => {
    let pid = req.params.pid
    const producto = await prod.deleteP(pid)
    producto ? res.send({status: "success", payload: producto}) : res.status(400).send({error:"no existe un producto con ese id"})
    let productos = await prod.getP()
    socketServer.emit("productdelete", productos)
})

viewsRouter.get('/register',(req, res) => {
    res.render('register',{})
})

viewsRouter.post('/register', async (req, res) => {
    let user = req.body
    let userFound = await userM.getByEmail(user.email)
    if(userFound){
        res.render('register-error',{})
    }
    user.password = createHash(user.password);
    let result = await userM.createUser(user)
    console.log(result)
    res.render('login', {})
})

viewsRouter.get('/login', (req, res) => {
    res.render('login', {})
})

viewsRouter.post('/login', async (req, res) => {
    let user = req.body
    let users = await userM.getAll()
    let userFound = users.find(u =>{
        return u.email == user.email && isValidPassword(u, user.password)
    })
    if(userFound){
        console.log(userFound)
        req.session.user = user.email
        if(userFound.rol == 'admin'){
            res.redirect('/realtimeproducts')
        }else{
            res.redirect('/profile')
        }
    }else{
        res.render('login-error',{})
    }
})

viewsRouter.get('/logout',(req, res) => {
    req.session.destroy(error => {
        res.render('login')
    })
})

viewsRouter.get('/profile', async (req, res) => {
    let user = await userM.getByEmail(req.session.user)
    if(user){
        res.render('datos', {user})
    }else{
        res.redirect('/login')
    }
    
})

viewsRouter.get('/restore', (req, res )=> {
    res.render('restore-password',{})
})

viewsRouter.post('/restore', async (req, res) => {
    let user = req.body;
    let userFound = await userM.getByEmail(user.email)
    if(!userFound) {
        res.render('register', {})
    }else {
        let newPassword = createHash(user.password)
        let result = await userM.updateUser(user.email, newPassword)
    }
    res.render('login', {})
})


// PASSPORT 

viewsRouter.get('/registerr', (req, res) => {
    res.render('register',{})
})

viewsRouter.post('/registerr', passport.authenticate('register',{failureRedirect:'/failregister'}), async (req, res) => {
    res.render('login',{})
})

viewsRouter.get('/failregister', async (req, res) => {
    res.render('register-error',{})
})

viewsRouter.get('/loginn', (req,res) => {
    res.render('login',{})
})

viewsRouter.post('/loginn', passport.authenticate('login', {failureRedirect: 'faillogin'}), async (req, res) => {
    if(!req.user) return res.render('login-error',{})
    req.session.user = req.user.email
    res.render('datos', {user: req.session.user})
})

viewsRouter.get('/faillogin', async (req, res) => {
    res.render('login-error',{})
})

viewsRouter.get('/github', passport.authenticate('github',{scope: ['user:email']}), async(req, res) => {})

viewsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/realtimeproducts')
})


export default viewsRouter;