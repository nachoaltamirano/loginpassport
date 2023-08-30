import { cartsmodel } from "../cart.model.js";
import { Productsmodel } from "../prod.model.js";

class CManager{
    constructor(){
        this.model = cartsmodel;
    }

    async createCart(){
        let newCart;
        let cart = {
            products: []
        }
        try {
           newCart = await this.model.create(cart) 
        } catch (error) {
            console.log(error);
        }
        return newCart;
    }

    async getCartById(cid){
        let cart;
        try {
            cart = await this.model.find({_id: cid}).populate('products')
        } catch (error) {
            console.log(error);
        }

        return cart;
    }

    addProductInCart = async (cid, pid) => {
        const cart = await cartsmodel.findOne({ _id: cid }).lean(); 
        const producto = await Productsmodel.findOne({ _id: pid }) 

        if (cart && producto) {
            const index = cart.products.findIndex(product => product.producto == pid);
            if (index != -1) {
                let total = cart.products[index].quantity
                cart.products[index].quantity = total + 1;
            } else {
                cart.products.push({ producto: pid, quantity: 1 });
            }

            const result = await cartsmodel.updateOne({ _id: cid }, { $set: cart }).lean();

            return ({
                code: 200,
                status: 'success',
                message: cart.products
            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'Hubo un error al agregar el producto'
            })
        }
    }


    deleteProductInCart = async (cid, pid) => {
        const cart = await cartsmodel.findOne({ _id: cid }); 

        const index = cart.products.find(producto => producto._id == pid);

        
        if (index != -1) {
            cart.products.splice(index, 1);
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'No existe el producto'
            })
        }

        const result = await cartsmodel.updateOne({ _id: cid }, { $set: cart })
        return ({
            code: 200,
            status: 'Success',
            message: `Producto eliminado correctamente `
        })
    }

    modCantidad = async (cid, pid, cantidad) => {
        const cart = await cartsmodel.findOne({_id: cid});
        const index = cart.products.findIndex(product => product.producto == pid)

        if (index != -1){
            cart.products[index].quantity = cantidad
        }else{
            return ({
                code: 400,
                status: 'Error',
                message: 'No existe el producto'
            })
        }
        const result = await cartsmodel.updateOne({_id: cid}, {$set: cart})

        return ({
            code: 200,
            status: 'Success',
            message: `Cantidad modificada `
        })
    }

    visualizarProd = async (cid) => {
        const cart = await cartsmodel.findOne({_id: cid})
        const prods = cart.products.map(elem => {
            return {
                _id: elem.producto,
                cantidad: elem.quantity
                
            }
        })
        return prods;
    }


}

export default CManager;