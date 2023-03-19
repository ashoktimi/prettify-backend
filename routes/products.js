"use strict";

// Routes for brands
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Product = require("../models/product")
const productNewSchema = require("../schemas/productNew.json");
const productUpdateSchema = require("../schemas/productUpdate.json");
const router = new express.Router();

router.post("/", async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, productNewSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
      }
        const product = await Product.create(req.body);
        return res.status(201).json({ product });
    } catch (err) {
        return next(err);
    }
})

router.get("/", async function (req, res, next){
    const q = req.query;

    try{
        const products = await Product.findAll(q);
        return res.json({ products });
    } catch (err) {
     return next(err);
    }
})

router.get("/lists", async function (req, res, next){
    try{
        const products = await Product.getSpecificProducts();
        return res.json({ products });
    } catch (err) {
     return next(err);
    }
})

router.get("/random", async function (req, res, next){
    try{
        const products = await Product.getRandom();
        return res.json({ products });
    } catch (err) {
     return next(err);
    }
})


router.get("/:id", async function(req, res, next){
    try{
        const product = await Product.get(req.params.id);
        return res.json({ product });
    } catch (err){
        return next(err);
    }
})

router.patch("/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, productUpdateSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const product = await Product.update(req.params.id, req.body);
        return res.json({ product });
    } catch (err) {
        return next(err);
    }
  });

router.delete("/:id", async function (req, res, next){
    try{
        await Product.remove(req.params.id);
        return res.json({ deleted: req.params.id })
    } catch (err){
        return next(err);
    }
})

module.exports = router;