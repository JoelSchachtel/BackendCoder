import { Router } from "express";
import FileManager from "../manager/fileManager.js";
import productModel from "../dao/models/products.model.js";

const fileManager = new FileManager('products.json')
const router = Router();
// const products = [];

router.get('/', async (req, res) => {
    // const products = await fileManager.get()
    const products = await productModel.find().lean().exec()
    let limit = req.query.limit
    if (!limit) res.render('home', {products})
    else {
        const prodLimit = [];
        if(limit > products.length) limit = products.length;
        for(let index = 0; index < limit; i++) {
            prodLimit.push(products[index]);
        }
    res.send({prodLimit})
    }
})

router.get('/realtimeproducts', async (req,res) => {
    const products = await productModel.find().lean().exec()
    res.render('rtProducts', {
        data: products
    })
})

router.post('/', async (req, res) => {
    // const {title, description, price, thumbnails, code, stock, category, status} = req.body
    // const addProduct = await fileManager.add(title, description, price, thumbnails, code, stock, category, status)
    // res.send(addProduct)
    try {
        const product = req.body
        if (!product.title) {
            return res.status(400).json({
                message: 'Error. Falta el nombre del producto'
            })
        }
        const productAdded = await productModel.create(product)
        req.originalUrl.emit('updatedProducts', await productModel.find().lean().exec())
        res.json({
            status: 'Success',
            productAdded
        })
    } catch (error) {
        console.log(error);
        res.json({
            error
        })
    }
})

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body
    // const {title, description, price, thumbnails, code, stock, category, status} = req.body
    // const updateProduct = await fileManager.updateById(title, description, price, thumbnails, code, stock, category, status)
    // res.send(updateProduct)
    const product = await productModel.updateOne({
        _id: id
    }, productToUpdate)
    req.io.emit('updatedProducts', await productModel.find().lean().exec())
    res.json({
        status: 'Success',
        product
    })
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const productDeleted = await productModel.deleteOne({
        _id: id
    })
    // const deleteProduct = await fileManager.deleteById(id)
    // res.send(deleteProduct)
    req.io.emit('updateProducts', await productModel.find().lean().exec())
    res.json({
        stauts: 'Success',
        message: 'Product deleted!',
        productDeleted
    })
})

export default router;