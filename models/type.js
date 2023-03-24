"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Type {
    static async create({ name, type }) {
        const duplicateCheck = await db.query(`SELECT id FROM type WHERE name = $1 AND type =$2`, [name, type])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate product type: ${name}`)
        const result = await db.query(`INSERT INTO type (name, type) VALUES ($1, $2) RETURNING id, name`, [name, type]);
        return result.rows[0];
    }

    static async findAll(){
        const typeRes = await db.query(`SELECT id, name, type FROM type`);
        return typeRes.rows;
    }

    static async findByType(type){
        const typeRes = await db.query(`SELECT id, name, type FROM type WHERE type = $1`,[type]);
        const typeName = typeRes.rows[0]
        if(!typeName) throw new NotFoundError(`No type of ${type} found`)
        return typeName
    }
  
    static async get(typ, name) {
        const typeRes = await db.query(`SELECT * FROM type WHERE type= $1 AND name = $2`, [typ, name]);
        const type = typeRes.rows[0];
        if(!type) throw new NotFoundError(`No product type of ${name} found`)

        const productRes = await db.query(
            `SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating, number_rating, category_id
             FROM product WHERE type_id = $1 ORDER BY id LIMIT ((SELECT COUNT(*) FROM product WHERE type_id = $1) / 3) * 3`, [type.id]
        );
        
        type.products = productRes.rows
        return type;
    }
  
    static async update(id, { name, type }) {
        const result = await db.query(`SELECT * FROM type WHERE id = $1`, [id]);
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No product type : ${id}`)
        const typeRes = await db.query(`UPDATE type SET name = $2, type =$3 WHERE id = $1 RETURNING id, name, type`, [id, name, type]);
        const types = typeRes.rows[0];   
        return types;
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