class ProductManager
{
    constructor() 
    {
        this.products = [];
        this.GeneratedID = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) 
    {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Falta un valor.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log("El código se repite.");
            return;
        }

        const product = 
        {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,

            id: this.GeneratedID
        };

        this.products.push(product);
        this.GeneratedID ++;
        console.log("Se agregó el producto: " + product.title + " con el ID " + product.id);
    }

    getProducts() 
    {
        return this.products;
    }

    getProductByID(id)
    {
        let product = this.products.find(product => product.id == id)
        if(product)
        {
            return product;
        }
        else
        {
            console.log("Not Found.");
        }
    }
}

//Creo la instancia de Product Manager.
const productManager = new ProductManager();

//Llamo a getProducts para que devuelva el array vacio.
console.log(productManager.getProducts());

//Llamo a addProduct y añado el producto prueba.
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//Obtengo el array con el producto recien agregado.
console.log(productManager.getProducts());

//Intengo añadir un producto con el mismo code, no funciona.
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//Intento obtener un producto con un ID existente.
console.log(productManager.getProductByID(0));

//Intento obtener un producto con un ID inexistente.
console.log(productManager.getProductByID(32));