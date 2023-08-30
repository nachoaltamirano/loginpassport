import { Productsmodel } from "../prod.model.js"

class PManager {
    constructor(){
        this.model = Productsmodel;
    }

 async getP(pageBody, limit, cat, sort){
    let prods;
    let options = {
        page: pageBody,
        limit: limit,
        sort: { price: sort === "desc" ? -1 : 1}
    }
    let query = {}

    if (cat) {
        query.category = cat
    }

    let noFiltersProvided = !pageBody && !limit && !cat && !sort;
    try {
        if (noFiltersProvided) {
            prods = await this.model.find();
        }else {
            prods = await this.model.paginate(query, options)
        }
    }catch(error){
        console.log(error)
    }
    return prods;
 }

 async getPById(id){
    let P;
    try {
      P = await this.model.findOne({ _id: id})
    } catch (error) {
        console.log(error)
    }

    return P;
 }

 async addP(P){
    let crearP;
    try {
        crearP = await this.model.create(P);
    } catch (error) {
        console.log(error);
    }
    return crearP;
 }

 async updateP(pid, properties){
    let P
    try {
        P = await this.model.updateOne({ _id: pid }, properties);
    } catch (error) {
        console.log(error);
    }
    return P;
 }

 async deleteP(pid){
    let P;
    try {
        P = this.model.deleteOne({_id: pid})
    } catch (error) {
        console.log(error)
    }

    return P;
}

async getCategory(query) {
    let category;
    try {
        category = this.model.find({category: query})
    } catch (error) {
        console.log(error)
    }
    return category;
}

async getSort(sor) {
    let response;
    try {
        if (sor == "asc"){
           response = await this.model.find().sort({price:-1})
        }else {
           response = await this.model.find().sort({price:1})
        } 
    } catch (error) {
        console.log(error)
    }
    return response
}

async visualizarProds() {
    let prods = await this.model.find().paginate('products')
    let prod = prods.map(elem => {
        return {
            title: elem.title,
            description: elem.description,
            id: elem._id,
            price: elem.price,
            stock: elem.stock,
            category: elem.category
        }
    })
    return prod
}
}



export default PManager;