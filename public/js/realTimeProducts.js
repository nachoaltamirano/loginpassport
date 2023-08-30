const socket = io()

let title = document.getElementById("nombre")
let description = document.getElementById("descripcion")
let price = document.getElementById("precio")
let id = document.getElementById("id")
let category = document.getElementById("categoria")
let stock = document.getElementById("stock")
let code = document.getElementById("codigo")
let btnadd = document.getElementById("btnadd")
let btndelete = document.getElementById("btndelete")
let products = document.querySelector("#productos")

btnadd.addEventListener("click", async (e) => {
    e.preventDefault()

    const product = {
        title: title.value,
        description: description.value,
        price: price.value,
        thumbnail: thumbnail.value,
        code: code.value,
        stock: stock.value,
        category: category.value
    }

    console.log("product desde el EventListener", product)

    if (!title.value || !description.value || !price.value || !code.value || !stock.value || !category.value) {
        return alert("por favor coloca todos los datos");
    }

    try {
        const response = await fetch("/realtimeproducts", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(product)
        })

        const postProductResponse = response.json()

        //console.log(postProductResponse)

        if (!postProductResponse) return alert(postProductResponse.response)

        title.value = ""
        description.value = ""
        category.value = ""
        price.value = ""
        code.value = ""
        stock.value = ""

    } catch (error) {
        console.error(error)
    }

})

btndelete.addEventListener("click", async (event) => {
    event.preventDefault()

    const deleteId = id.value

    if (!deleteId) return alert("coloca el Id por favor")

    try {
        const response = await fetch(`/realtimeproducts/${deleteId}`, {
            method: "DELETE"
        })
        const product = await response.json()


        if (!product) return alert(product)

        id.value = ""

        alert("Product deleted.")
    } catch (error) {
        console.error(error)
    }
})

const createHtml = (data) => {
    return data.length
        ? data.map(product => {
            products.innerHTML += `
        <h3 ><span>Nombre: </span>${product.title}</h3>
        <h5 ><span>ID: </span>${product._id}</h5>
        <h5 ><span>Descripcion: </span>${product.description}</h5>
        <h5 ><span>Precio: </span>${product.price}</h5>
        <h5 ><span>Imagen: </span>${product.thumbnail}</h5>
        <h5 ><span>Stock: </span>${product.stock}</h5>
        <h5 ><span>Codigo: </span>${product.code}</h5>
        <h5 ><span>Categoria: </span>${product.category}</h5>
        `
        })
        : products.innerHTML += `
        <h3 ><span>Nombre: </span>${data.title}</h3>
        <h5 ><span>ID: </span>${data._id}</h5>
        <h5 ><span>Descripcion: </span>${data.description}</h5>
        <h5 ><span>Precio: </span>${data.price}</h5>
        <h5 ><span>Imagen: </span>${data.thumbnail}</h5>
        <h5 ><span>Stock: </span>${data.stock}</h5>
        <h5 ><span>Codigo: </span>${data.code}</h5>
        <h5 ><span>Categoria: </span>${data.category}</h5>
        `
}

socket.on("newproduct", data => {
    products.innerHTML = ""
    createHtml(data);
    //window.location.reload();
})

socket.on("productdelete", data => {
    products.innerHTML = ""
    createHtml(data)
})
