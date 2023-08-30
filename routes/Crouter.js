import { Router } from "express";
import CManager from "../models/DAO/cartM.js";
const Crouter = Router();

const manager = new CManager;

Crouter.post("/", async (req, res)=>{
    let newCart; 
    try {
      newCart = await manager.createCart();
      res.send({ status: "success", msg: "carrito creado"})
    } catch (error) {
        res.status(400).send({ status: "error", msg: "error" }) 
    } 
});

Crouter.get("/:cid", async (req, res)=>{
    let cid = req.params.cid;
    let product;
    try {
      product = await manager.getCartById(cid);
      console.log(JSON.stringify(product, null, '\t'))
    } catch (error) {
      res.status(400).send({ status: "error", msg: "Producto no encontrado" }) 
    }
    res.send({ status: "success", payload: product})
});

Crouter.post("/:cid/products/:pid", async(req, res)=>{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const productCart = await manager.addProductInCart(cid, pid);

    res.status(productCart.code).send({ status: productCart.status, message: productCart.message });
})

Crouter.delete("/:cid/products/:pid", async(req, res)=> {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await manager.deleteProductInCart(cid, pid);
    
    res.status(result.code).send({ status: result.status, message: result.message });
    })

Crouter.put("/:cid/products/:pid", async(req,res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    let {cantidad} = req.body;

    let result = await manager.modCantidad(cid, pid, cantidad)
    res.status(result.code).send({ status: result.status, message: result.message })
})


Crouter.delete('/:cid', async(req, res)=>{
    let cid = req.params.cid;

    let carrito = await manager.getCartById(cid)
    if(!carrito){
        res.status(400).send({status: "error", msg:"Carrito no encontrado"})
    }

    carrito.products = [];
    await carrito.save();
    res.send({status:"success", msg:"Se han borrado todos los productos del carrito"})

})


export default Crouter;