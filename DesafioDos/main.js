import {promises as fs} from 'fs'

class ProductManager
{
    constructor(path) 
    {
        this.path = path;
        this.products = [];
    }

    addProduct = async(newProduct) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        if(products.find(product => product.id == newProduct.id))
        {
            return "Product already exists."
        }

        products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(products))
    }

    getProducts = async() =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        console.log(products);
    }

    getProductByID = async(id) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const foundID = products.find(product => product.id == id)

        if(foundID)
        {
            console.log(foundID);
        }
        else
        {
            console.log("Not Found.");
        }
    }

    updateProduct = async(id, {title, description, price, thumbnail, code, stock}) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const index = products.findIndex(product => product.id === id)

        if(index != -1)
        {
            products[index].title = title;
            products[index].description = description;
            products[index].price = price;
            products[index].thumbnail = thumbnail;
            products[index].code = code;
            products[index].stock = stock;

            await fs.writeFile(this.path, JSON.stringify(products))
        }
        else
        {
            console.log("Not Found.");
        }
    }

    removeProduct = async(id) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const prods = products.filter(product => product.id != id);

        await fs.writeFile(this.path, JSON.stringify(prods))
    }
}

class Product
{
    constructor(title, description, price, thumbnail, code, stock)
    {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.increaseID();
    }

    static increaseID()
    {
        if(this.idIncrease)
        {
            this.idIncrease++;
        }
        else
        {
            this.idIncrease = 1;
        }

        return this.idIncrease;
    }
}

const productManager = new ProductManager("./DesafioDos/products.txt");

const product1 = new Product("Arroz", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
const product2 = new Product("Fideos", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//productManager.addProduct(product1);
//productManager.addProduct(product2);

//productManager.getProducts();
//productManager.getProductByID(2);
//productManager.getProductByID(3);

//productManager.updateProduct(1, {title:"Arroz", description:"Nuevo Arroz", price: 250, thumbnail:"Seguimos sin imagen", code:"dfg456", stock:10});

//productManager.removeProduct(1);