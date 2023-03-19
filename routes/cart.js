"use strict";

// Routes for  carts
const express = require("express");
const Cart = require("../models/cart")
const router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
      const carts = await Cart.get(req.body);
      return res.json({ carts });
    } catch (err) {
      return next(err);
    }
  });
  


  module.exports = router;