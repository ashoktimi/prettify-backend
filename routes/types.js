"use strict";

// Routes for brands
const express = require("express");
const Type = require("../models/type")
const router = new express.Router();

router.post("/", async function (req, res, next){
    try{
        const types = await Type.create(req.body);
        return res.status(201).json({ types });
    } catch (err) {
        return next(err);
    }
})

router.get("/", async function (req, res, next){
    try{
        const types = await Type.findAll();
        return res.json({ types });
    } catch (err) {
        return next(err);
    }
})

router.get("/:type", async function (req, res, next){
    try{
        const types = await Type.findByType(req.params.type);
        return res.json({ types });
    } catch (err) {
        return next(err);
    }
})

router.get("/:type/:name", async function(req, res, next){
    try{
        const type = await Type.get(req.params.name);
        return res.json({ type });
    } catch (err){
        return next(err);
    }
})

router.patch("/:id", async function (req, res, next) {
    try {
      const type = await Type.update(req.params.id, req.body);
      return res.json({ type });
    } catch (err) {
      return next(err);
    }
  });

router.delete("/:id", async function (req, res, next){
    try{
        await Type.remove(req.params.id);
        return res.json({ deleted: req.params.id })
    } catch (err){
        return next(err);
    }
})

module.exports = router;