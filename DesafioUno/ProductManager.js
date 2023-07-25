class ProductManager
{
    constructor(products = []) 
    {
        this.products = products;
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
        const product = this.products.find(product => product.id == id)
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

const productManager = new ProductManager();

console.log(productManager.getProducts());
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager.getProducts());
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(productManager.getProductByID(0));
console.log(productManager.getProductByID(32));