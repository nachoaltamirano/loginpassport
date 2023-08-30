import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
   title: {
       type: String,
       required: true
   },
   description: {
       type: String,
       required: true
   },
   price: {
       type: String,
       required: true
   },
   code: {
       type: String,
       required: true
   },
   stock: {
       type: String,
       required: true
   },
   category: {
       type: String,
       required: true
   }
});

productSchema.plugin(mongoosePaginate)
export const Productsmodel = mongoose.model(productsCollection, productSchema);