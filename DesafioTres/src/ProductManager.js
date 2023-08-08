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

        if(products.find(product => product.id === newProduct.id))
        {
            return "Product already exists."
        }

        products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(products))
    }

    getProducts = async(productLimit) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const slicedProds = products.slice(0, productLimit);
        console.log(slicedProds);
        return slicedProds;
    }

    getProductByID = async(id) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        //const foundID = products.find(product => product.id === id)
        const foundID = products.find(product => product.id === parseInt(id))

        if(foundID)
        {
            console.log(foundID);
            return foundID;
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
export default ProductManager;

//const productManager = new ProductManager("./DesafioDos/products.txt");