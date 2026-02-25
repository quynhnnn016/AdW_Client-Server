const express = require("express")
const router = express.Router();

//Connect MongoDB
const db = require('../config/db');
db.connect();

//Import model
const Product = require("../models/Product")

// Define API
router.get("/", (req, res) => {
    res.send('Hello');
});

//===========================SELECT===========================

//Get all products (1) --> support optional filters via query string
// Example: /products?name=hee&minPrice=10000&maxPrice=25000
router.get("/products", async (req, res) => {
    try {
        const { name, minPrice, maxPrice } = req.query;
        const filter = {};

        if (name) {
            // partial, case-insensitive match
            filter.name = { $regex: String(name), $options: 'i' };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
            // if price filter ended up empty, remove it
            if (Object.keys(filter.price).length === 0) delete filter.price;
        }

        const data = await Product.find(filter);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        // If the id provided isn't a valid ObjectId, Mongoose will throw
        res.status(400).json({ message: err.message });
    }
});

// Get all Products (2) --> using Async - Await
router.get("/allproduct", async (req, res) => {
    try{
        let products = await Product.find()
        res.json(products)
    }catch(err){
        res.json({err: err.message})
    }
});

//===========================INSERT===========================

// Post product
router.post("/products", async (req, res) => {
    //console.log(req.body);
    const p = new Product({
        name: req.body.name,
        price: req.body.price,
    });

    try {
        const saveProduct = await p.save();
        res.send("Success!")
    } catch (err) {
        res.json({ message: err.message });
    }
});

//===========================UPDATE===========================
router.patch("/:id", async (req, res) => {
    try {
        await Product.updateOne(
            {_id: req.params.id}, 
            {$set: {name:req.body.name, price: req.body.price}}
        );
        res.json({status: "Success!"})
    } catch (err) {
        res.json({message: err.message})
    }
});

//===========================DELETE===========================
router.delete("/:id", async (req, res) => {
    try {
        await Product.deleteOne({_id: req.params.id});
        res.json({status: "Success!"})
    } catch (err) {
        res.json({message: err.message})
    }
});

module.exports = router;