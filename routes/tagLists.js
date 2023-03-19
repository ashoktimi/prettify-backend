"use strict";

// Routes for TagLists
const express = require("express");
const TagList = require("../models/tagList")
const router = new express.Router();

router.post("/", async function (req, res, next){
    try{
        const tagList = await TagList.create(req.body);
        return res.status(201).json({ tagList });
    } catch (err) {
        return next(err);
    }
})


router.get("/", async function (req, res, next){

    try{
        const tagLists = await TagList.findAll();
        return res.json({ tagLists });
    } catch (err) {
        return next(err);
    }
})

router.get("/:id", async function(req, res, next){
    try{
        const taglists = await TagList.get(req.params.id);
        return res.json({ taglists });
    } catch (err){
        return next(err);
    }
})


router.patch("/:id", async function (req, res, next) {
    try {
      const taglist = await TagList.update(req.params.id, req.body);
      return res.json({ taglist });
    } catch (err) {
      return next(err);
    }
  });

router.delete("/:id", async function (req, res, next){
    try{
        await TagList.remove(req.params.id);
        return res.json({ deleted: req.params.id })
    } catch (err){
        return next(err);
    }
})

module.exports = router;