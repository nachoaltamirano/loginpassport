import mongoose from "mongoose";

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
    products: {
        type: Array
      }

});

export const cartsmodel = mongoose.model(cartCollection, cartSchema);