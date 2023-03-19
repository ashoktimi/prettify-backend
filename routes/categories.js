"use strict";

// Routes for categorys
const express = require("express");
const Category = require("../models/category")
const router = new express.Router();


router.post("/", async function (req, res, next){
    try{
        const category = await Category.create(req.body);
        return res.status(201).json({ category });
    } catch (err) {
        return next(err);
    }
})

router.get("/", async function (req, res, next){
    try{
        const categories = await Category.findAll();
        return res.json({ categories });
    } catch (err) {
     return next(err);
    }
})

router.get("/:id", async function(req, res, next){
    try{
        const category = await Category.get(req.params.id);
        return res.json({ category });
    } catch (err){
        return next(err);
    }
})

router.patch("/:id", async function (req, res, next) {
    try {
      const category = await Category.update(req.params.id, req.body);
      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  });

router.delete("/:id", async function (req, res, next){
    try{
        await Category.remove(req.params.id);
        return res.json({ deleted: req.params.id })
    } catch (err){
        return next(err);
    }
})

module.exports = router;