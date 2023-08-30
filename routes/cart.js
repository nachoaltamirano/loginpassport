import { Router } from "express";
import CartManager from "../CartManager.js";

let cartRouter = Router();

let manager = new CartManager();

cartRouter.post('/', async(req, res) => {
    let cart = await manager.crearCarrito()
    if(!cart){
        res.status(400).send({ status:'error', msj: 'Producto no encontrado'})
    }
    res.send({status:'hecho'})
})

cartRouter.get('/:cid', async(req, res) => {
    let cid = req.params.cid;
     let carritos = await manager.getCart()
    let cartId = carritos.find(cart => cart.id == cid);
    if(!cartId){
        res.status(400).send({ status:'error', msj: 'No existe un producto con ese id'})
    }
    res.send(cartId)
})

cartRouter.post('/:cid/product/:id', async(req, res) => {
    let cid = req.params.cid;
    let id = req.params.id;
    let prodAgregar = await manager.addProdToCart(cid, id);
    if(!prodAgregar){
        res.status(400).send({ status:'error', msj: 'No se pudo agregar el producto'})
    }
    res.send(prodAgregar)
})

export default cartRouter;
