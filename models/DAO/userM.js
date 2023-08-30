import { userModel } from "../user.model.js";

class UserManager{
   constructor(){
    this.model = userModel;
   }
    
async getAll() {
    let result;
    try {
        result = await this.model.find()
    } catch (error) {
        console.log(error)
    }

    return result;
}

async getByEmail(email) {
    let result;
    try {
        result = await this.model.findOne({ email })
    } catch (error) {
        console.log(error)
    }

    return result;
}

async getById(id) {
    let result;
    try {
        result = await this.model.findOne({ _id: id })
    } catch (error) {
        console.log(error)
    }

    return result;
}

async createUser(user) {
    let result;
    try {
        result = await this.model.create(user)
    } catch (error) {
        console.log(error)
    }

    return result;
}

async updateUser(email, newPassword){
    let result;
    try {
        result = await this.model.updateOne({email: email}, {set: {password: newPassword}})
    } catch (error) {
        console.log(error)
    }
    return result;
}
}

export default UserManager;
