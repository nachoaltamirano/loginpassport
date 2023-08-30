import { Router } from "express";
import PManager from '../models/DAO/prodM.js';
import { Productsmodel } from "../models/prod.model.js";
const Prouter = Router()

const manager = new PManager;


Prouter.get('/', async (req,res) => {
    const pageBody = req.query.page || 1;
    const limit = req.query.limit || 10;
    const cat = req.query.category;
    const sort = req.query.sort || "asc";
    try {
        let categories = await manager.getCategory()
        categories = categories.map((category) => ({
            name: category,
            selected: category === cat
        }))
        let result = await manager.getP(pageBody, limit, cat, sort)

        let data = {
            prods: result.docs,
            hasPrevPage: result.hasPrevPage,
            prevPage: result.prevPage,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            page: result.page,
            prevLink: result.hasPrevPage ? `/api/p?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/p?page=${result.nextPage}` : null
        }
        res.send(data)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno')
    }
});


Prouter.get("/:pid", async (req, res)=>{
    let pid = req.params.pid;
    let product;
    try {
        product = await manager.getPById(pid)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    res.send({status: "success", payload: product})
});

Prouter.post("/", async (req, res)=>{
    let P = req.body;
    if (!P.title || !P.description || !P.code || !P.price || !P.stock || !P.category) {
        return  res.status(400).send({status: "error", error})
    }
    try {
        await manager.addProduct(P)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    res.send({status: "success", msg: "Product creado"})
});

Prouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let P = req.body;
    if (!P.title || !P.description || !P.code || !P.price || !P.stock || !P.category) {
        return  res.status(400).send({status: "error", error})
    }
    try {
        await manager.updateProduct(pid, P)
    } catch (error) {
        res.status(400).send({status: "error", error})
    }
    res.send({status: "success", msg: "Producto updateado"})
});

Prouter.delete("/:pid", async(req, res)=>{
    let pid = req.params.pid;
    let productDelete; 
    try {
        productDelete = await manager.deleteProduct(pid);
    } catch (error) {
        res.status(400).send({ status: "error", msg: "error al borrar el producto" })
    }
    res.send({ status: "success", msg: "Producto borrado"})
})

export default Prouter;