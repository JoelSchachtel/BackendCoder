import { Router } from "express";
import FileManager from "../manager/fileManager.js";

const fileManager = new FileManager('products.json')
const router = Router();
// const products = [];

router.get('/', async (req, res) => {
    const products = await fileManager.get()
    let limit = req.query.limit
    if (!limit) res.render('home', {products});
    else {
        const prodLimit = [];
        if(limit > products.length) limit = products.length;
        for(let index = 0; index < limit; i++) {
            prodLimit.push(products[index]);
        }
    res.render('home', {products});
    }
    req.io.emit('updatedProducts', products);
})

router.get('/add-product', async (req, res) => {
    res.render('new-product');
});

router.get('/products/:pid', async (req, res) => {
    const id = req.params.pid;
    const product = await FileManager.getById(id);
    res.send({product});
})

router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    console.log({...req.body});
    const addProduct = await fileManager.add(title, description, price, thumbnails, code, stock, category, status);
    req.io.emit('updatedProducts', await fileManager.get());
    res.send(addProduct);
})

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await fileManager.updateById(title, description, price, thumbnails, code, stock, category, status);
    req.io.emit('updatedProducts', await fileManager.get());
    res.send(updateProduct);
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const deleteProduct = await fileManager.deleteById(id)
    req.io.emit('updatedProducts', await fileManager.get())
    res.send(deleteProduct)
})

router.get('/home', async (req, res) => {
    const products = await fileManager.get();
    res.render('home', 
    {
        title: 'Products list',
        products: products
    })
})

router.get('/realtimeproducts', async (req, res) =>{
    const products = await fileManager.get()
    res.render('realTimeProducts',
    {
        title: "Lista de Productos",
        products: products
    })

})

export default router;