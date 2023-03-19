"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Category {
    static async create({ name }) {
        const duplicateCheck = await db.query(`SELECT id FROM category WHERE name = $1`, [name])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate category: ${name}`)
        const result = await db.query(`INSERT INTO category (name) VALUES ($1) RETURNING id, name`,[name]);
        return result.rows[0];
    }


    static async findAll(){
        let categoryRes = await db.query(`SELECT * FROM (
                     SELECT c.id, c.name as name, COUNT(p.id) as product_count
                     FROM category c
                     LEFT JOIN product p ON c.id = p.category_id
                     GROUP BY c.id, c.name
                     HAVING COUNT(p.id) >= 3
                     ) subquery     
                     ORDER BY subquery.product_count DESC; `);
        return categoryRes.rows;
    }
  
    static async get(id) {
        const categoryRes = await db.query(`SELECT * FROM category WHERE id = $1`, [id]);
        const category = categoryRes.rows[0];
        if(! category) throw new NotFoundError(`No category : ${id}`)

        const productRes = await db.query(
            `SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating, number_rating, type_id
             FROM product WHERE category_id = $1 ORDER BY id LIMIT ((SELECT COUNT(*) FROM product WHERE category_id = $1) / 3) * 3`, [id]
        );
        category.products = productRes.rows
        return category;
    }
  
    static async update(id, { name }) {
        const result = await db.query(`SELECT * FROM category WHERE id = $1`, [id]);
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No category : ${name}`)
        const categoryRes = await db.query(`UPDATE category SET name = $2 WHERE id = $1 RETURNING id, name`, [id, name]);
        const category = categoryRes.rows[0];
        return category;
    }
  
    static async remove(id) {
        const result = await db.query(`SELECT * FROM category WHERE id = $1`, [id]);
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No category : ${id}`)
        const categoryRes = await db.query(`DELETE FROM category WHERE id = $1`,[id]);
        const category = categoryRes.rows[0];
        return category;
    }
  }
  
  module.exports = Category;