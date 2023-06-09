"use strict";
/** Express app for prettify. */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const brandRoutes = require("./routes/brands");
const categoryRoutes = require("./routes/categories");
const typeRoutes = require("./routes/types")
const productRoutes = require("./routes/products")
const tagListRoutes = require("./routes/tagLists")
const userRoutes = require("./routes/users");
const CartRoutes = require("./routes/cart");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/brands", brandRoutes);
app.use("/categories", categoryRoutes);
app.use("/types", typeRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/tags", tagListRoutes);
app.use("/carts", CartRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
module.exports = app;