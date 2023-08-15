import {promises as fs, stat} from 'fs'

export class ProductManager
{
    constructor(path) 
    {
        this.path = path;
        this.products = [];
    }

    static increaseID()
    {
        if(this.idIncrease)
        {
            this.idIncrease++
        }
        else
        {
            this.idIncrease = 1
        }
        return this.idIncrease
    }

    addProduct = async(newProduct) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = products.find(product => product.code === newProduct.code)

        if(existProd)
        {
            return false
        }
        else
        {
            newProduct.id = ProductManager.increaseID()
            products.push(newProduct)
            await fs.writeFile(this.path, JSON.stringify(products))
            return true;
        }
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
            //console.log(foundID);
            return foundID;
        }
        else
        {
            return false;
            console.log("Not Found.");
        }
    }

    updateProduct = async(id, {title, description, code, price, status, stock, category, thumbnails}) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const index = products.findIndex(product => product.id === id)

        if(index != -1)
        {
            products[index].title = title;
            products[index].description = description;
            products[index].code = code;
            products[index].price = price;
            products[index].status = status
            products[index].stock = stock;
            products[index].category = category;
            products[index].thumbnails = thumbnails;

            await fs.writeFile(this.path, JSON.stringify(products))
            return true;
        }
        else
        {
            console.log("Not Found.");
            return false;
        }
    }

    deleteProduct = async(id) =>
    {
        const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const reqProduct = products.find(product => product.id === id)

        if(reqProduct)
        {
            const prods = products.filter(product => product.id != id);
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true;
        }
        else
        {
            return false;
        }  
    }

}
export default ProductManager;

//const productManager = new ProductManager("./DesafioDos/products.txt");