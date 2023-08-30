import { Router } from "express";
import ProductManager from '../ProductManager.js';
import { validarProd } from "../utils/index.js";
import { getid } from "../ProductManager.js";

 let productRouter = Router();

const manager = new ProductManager()


productRouter.get("/", async(req, res)=>{
    let productos = await manager.getProducts()
    let { limit } = req.query;
    let limitProducts = limit ? productos.slice(0, limit) : productos
    res.send(limitProducts)
})

productRouter.get('/:id', async (req, res) => {
    let id = req.params.id;
    let productos = await manager.getProducts();
    let prods = productos.find(prod => prod.id == id);
    if(!prods){
        res.status(400).send({ status:'error', msj: 'No existe un producto con ese id'})
    }
    res.send(prods)

})

productRouter.post('/', async(req, res) => {
    let product = req.body;
    if(!validarProd(product)){
        res.status(400).send({ status:'error', msj: 'Producto invalido'})
    }
    product.id = getid();
    product.status = true;
    await manager.addProduct(product)
    
})

productRouter.put('/:id', async(req, res) => {
    let id = req.params.id;
    let algo = req.body;
    let productoAct = await manager.updateProduct(id, algo)
    if(!productoAct){
        res.status(400).send({ status:'error', msj: 'Producto no encontrado'})
    }
    res.send({status: 'hecho', msj:'producto actualizado'})
})


productRouter.delete('/:id', async(req, res) => {
    let id = req.params.id;
   let borrado = await manager.deleteProduct(id);
   if(!borrado){
    res.status(400).send({ status:'error', msj: 'Producto no encontrado'})
}
res.send({status: 'hecho', msj:'producto borrado'})
})
export default productRouter;