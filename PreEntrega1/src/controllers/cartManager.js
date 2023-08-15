import {promises as fs} from 'fs'

export class CartManager
{
    constructor(path)
    {
        this.carts = [];
        this.path = path;
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
    
    createCart = async() =>
    {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        
        const newCart =
        {
            id: CartManager.increaseID(),
            products: []
        };

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts))
        return true;
    }

    getProductsInCart = async(cartID) =>
    {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const reqCart = carts.find(cart => cart.id === cartID)

        if(reqCart)
        {
            return carts[cartID].products;
        }
    }
    
    addProductToCart = async(cartID, prodID) =>
    {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        const reqCart = carts.find(cart => cart.id === cartID)

        if(reqCart)
        {
            for (const product of reqCart.products)
            {
                if(product.id === prodID)
                {
                    product.quantity ++;
                    await fs.writeFile(this.path, JSON.stringify(carts))
                    return true;
                }
            }

            const newProduct =
            {
                id: prodID,
                quantity: 1
            };
            reqCart.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(carts))
            return true;
        }
        else
        {
            return false;
        }
    }
}

export default CartManager;