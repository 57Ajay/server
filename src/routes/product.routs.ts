import { Router } from "express";

const productRouter = Router()

productRouter.get('/', (req, res) => {
    res.send('products');
})

productRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send(`products ${id}`);
})

export default productRouter