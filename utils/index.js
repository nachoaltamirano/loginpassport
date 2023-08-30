 export const validarProd = product => {
    let resultado = true;
    if(!product.title || !product.description || !product.code || !product.stock || !product.category){
        resultado = false;
    }
    return resultado;
}