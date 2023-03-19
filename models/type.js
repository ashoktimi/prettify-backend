"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Type {
    static async create({ name }) {
        const duplicateCheck = await db.query(`SELECT id FROM type WHERE name = $1`, [name])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate product type: ${name}`)
        const result = await db.query(`INSERT INTO type (name) VALUES ($1) RETURNING id, name`, [name]);
        return result.rows[0];
    }

    static async findAll(){
        const typeRes = await db.query(`SELECT id, name, type FROM type`);
        return typeRes.rows;
    }

    static async findByType(type){
        const typeRes = await db.query(`SELECT id, name, type FROM type WHERE type = $1`,[type]);
        return typeRes.rows;
    }
  
    static async get(name) {
        const typeRes = await db.query(`SELECT * FROM type WHERE name = $1`, [name]);
        const type = typeRes.rows[0];
        console.log(type.id)
        if(! type) throw new NotFoundError(`No product type : ${name}`)

        const productRes = await db.query(
            `SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, product_link, website_link, description, rating, number_rating, category_id
             FROM product WHERE type_id = $1 ORDER BY id LIMIT ((SELECT COUNT(*) FROM product WHERE type_id = $1) / 3) * 3`, [type.id]
        );
        
        type.products = productRes.rows
        return type;
    }
  
    static async update(id, { name }) {
        const result = await db.query(`SELECT * FROM type WHERE id = $1`, [id]);
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No product type : ${id}`)
        const typeRes = await db.query(`UPDATE type SET name = $2 WHERE id = $1 RETURNING id, name`, [id, name]);
        const type = typeRes.rows[0];   
        return type;
    }
  
    static async remove(id) {
        const result = await db.query(`SELECT * FROM type WHERE id = $1`, [id]);
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No product type : ${id}`)
        const typeRes = await db.query(`DELETE FROM type WHERE id = $1`,[id]);
        const type = typeRes.rows[0];
        return type;
    }
  }
  
  module.exports = Type;