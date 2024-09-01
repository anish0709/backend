const express = require('express');
const router = express.Router();
const productModel = require('../models/product_model');
const JWT = require('jsonwebtoken');

//middleware
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     try {
//         const decoded = JWT.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.user;
//         next();
//     } catch (error) {
//         res.status(400).json({ error: 'Invalid token' });
//     }
// };


// with bearer
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    // Check if token exists and starts with 'Bearer '
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        // Remove 'Bearer ' from the token string
        const decoded = JWT.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

//posting a product
router.post("/addProduct", verifyToken, async(req, res) => {
    try {
        const {title, desc, price, quantity, images, stock, fastDelivery, featured, sortOrder, ratings, category} = req.body;

        if(!title || !price || !desc || !category || !images) {
            return res.status(400).json({ error: 'One or more mandatory fields are empty'});
        }

        const newProduct = new productModel({
            title, desc, price, quantity, images, stock, 
            fastDelivery, featured, sortOrder, ratings, category
        });

        let product = await newProduct.save();

        res.status(200).json({status: 201, message:"product added successfully",product});
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});


// getting all products
router.get('/getproducts', async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//getting a particular product
router.get("/product/:productId", async(req, res) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if(!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});


// Updating a particular product by its id
router.put("/updateproducts/:productId", verifyToken, async(req, res) => {
    try {
        const { title, desc, price, quantity, images, stock, fastDelivery, featured, sortOrder, ratings, category } = req.body;

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.productId,
            { title, desc, price, quantity, images, stock, fastDelivery, featured, sortOrder, ratings, category },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});


// deleting a product by its ID
router.delete("/delete/:productId", verifyToken, async(req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

//update product stock
router.patch("/updateproductstock/:productId", verifyToken, async (req, res) => {
    try{
        const {stock} = req.body;
        const {productId} = req.params;
        let Product = await productModel.findById(productId);
        
        if(!Product) return res.status(404).json({error: 'Product not found'});

        Product.stock = stock;
        await Product.save();
        res.status(200).json(Product);
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
})


// Add product review
router.patch("/addReview/:productId", async (req, res) => { 
    try
    {
        const { productId } = req.params;
        const { userId, rating, comment } = req.body;  

        let newReview = {
            user: userId,
            rating,
            comment
        };

        let Product = await productModel.findById(productId);
        
        if (!Product) return res.status(404).json({ error: 'Product not found' });

        Product.reviews.push(newReview);
        await Product.save();
        res.status(200).json({
            message: "Review added successfully",
            product: Product
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;