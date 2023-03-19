"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");



/** Related functions for products. */
class Product {
    static async create({ productKey, brandId, name, price, priceSign, prevPrice, imageLink, productLink, websiteLink, description, rating,  numberRating, categoryId, typeId, createdAt, updatedAt }) {
        const duplicateCheck = await db.query(`SELECT id FROM product WHERE name = $1`, [name])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate product: ${name}`)
        const result = await db.query(`INSERT INTO product (product_key, brand_id, name, price, price_sign, prev_price, image_link, product_link, website_link, description, rating,  number_rating, category_id, type_id, created_at, 
            updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, product_key, brand_id, name, price, price_sign, prev_price, image_link, product_link, website_link, description, rating,  number_rating, category_id, type_id, created_at, 
            updated_at`, 
            [productKey, brandId, name, price, priceSign, prevPrice, imageLink, productLink, websiteLink, description, rating, categoryId, typeId, createdAt, updatedAt ]);
        return result.rows[0];
    }

    static async findAll(searchFilters = {}){
        let query = `SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating,  number_rating, category_id, type_id
        FROM product`;
        let whereExpressions = [];
        let queryValues = [];
        const { name } = searchFilters;

        // For each possible search term, add to whereExpressions and queryValues so
        // we can generate the right SQL
        if(name){
            queryValues.push(`%${name}`);
            whereExpressions.push(`name ILIKE $${queryValues.length} `)
        }

        if(whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        // Finalize query and return results
        query += ` ORDER BY name LIMIT (
            SELECT CEILING(COUNT(*) / 3.0) * 3
            FROM product
        )`;
        const productRes = await db.query(query, queryValues);
        return productRes.rows;
    }


    static async getRandom(){
        const productRes = await db.query(`SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating, number_rating, category_id, type_id
        FROM product
        ORDER BY RANDOM()
        LIMIT 15`)
        const product = productRes.rows;
        return product;        
    }

    // this returns a specific list of products to display
    // the reason to have this method to get the products with nice image since the all products dom't have nice image so want to display these product
    // in the products list page just to have a nice view of the project. 


    static async getSpecificProducts() {        
        const productRes = await db.query(`SELECT * FROM product WHERE id IN ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`, 
            [45, 700, 331, 651, 92, 81, 510, 660, 502, 690, 824, 512, 513, 506, 603]);
        const product = productRes.rows;
        return product;
    }
  
  
    static async get(id) {
        const productRes = await db.query(`SELECT * FROM product WHERE id = $1`, [id]);
        const product = productRes.rows[0];
        if(! product) throw new NotFoundError(`No product : ${id}`)
        const colorRes = await db.query(
            `SELECT hex_value, color_name  
             FROM product_color WHERE product_id = $1 ORDER BY id LIMIT 99`,[id]
        );
        product.colors = colorRes.rows;
        return product;
    }
  
    static async update(id, data) {
        const getResult = await db.query(`SELECT * FROM product WHERE id = $1`, [id]);
        const res = getResult.rows[0];
        if(!res) throw new NotFoundError(`No product : ${id}`)
        const { setCols, values } = sqlForPartialUpdate(            
            data,
            {
                productKey: "product_key",
                brandId: "brand_id",
                priceSign: "price_sign",
                prevPrice: "prev_price",
                imageLink: "image_link",
                productLink: "product_link",
                websiteLink: "website_link",
                categoryId: "category_id",
                typeId: "type_id",
                createdAt: "created_at",
                updatedAt: "updated_at"
            }
        )
        const handleVarIdx = "$" + (values.length + 1);
        const querySql = `UPDATE product SET ${setCols} WHERE id = ${handleVarIdx} RETURNING id, product_key, brand_id, name, price, price_sign, prev_price, image_link, product_link, website_link, description, rating,  number_rating, category_id, type_id, created_at, 
        updated_at`;
        const result = await db.query(querySql, [...values, id]);
        const product = result.rows[0];       
        return product;
    }
  
    static async remove(id) {
        const getResult = await db.query(`SELECT * FROM product WHERE id = $1`, [id]);
        const res = getResult.rows[0];
        if(!res) throw new NotFoundError(`No product : ${id}`)
        const productRes = await db.query(`DELETE FROM product WHERE id = $1`,[id]);
        const product = productRes.rows[0];
        return product;
    }
  }
  
  module.exports = Product;



