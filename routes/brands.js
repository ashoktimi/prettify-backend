"use strict";

// Routes for brands
const express = require("express");
const Brand = require("../models/brand")
const router = new express.Router();


router.post("/", async function (req, res, next){
    try{
        const brand = await Brand.create(req.body);
        return res.status(201).json({ brand });
    } catch (err) {
        return next(err);
    }
})

router.get("/", async function (req, res, next){
    try{
        const brands = await Brand.findAll();
        return res.json({ brands });
    } catch (err) {
        return next(err);
    }
})

router.get("/:id", async function(req, res, next){
    try{
        const brand = await Brand.get(req.params.id);
        return res.json({ brand });
    } catch (err){
        return next(err);
    }
})

router.patch("/:id", async function (req, res, next) {
    try {
      const brand = await Brand.update(req.params.id, req.body);
      return res.json({ brand });
    } catch (err) {
      return next(err);
    }
  });

router.delete("/:id", async function (req, res, next){
    try{
        await Brand.remove(req.params.id);
        return res.json({ deleted: req.params.id })
    } catch (err){
        return next(err);
    }
})

module.exports = router;