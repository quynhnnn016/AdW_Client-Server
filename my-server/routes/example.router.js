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

//Get all products (1) --> using Promise
router.get("/products", (req, res) => {
    Product.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({error: err.message}));
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