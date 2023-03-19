"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
   
class Brand {
    static async create({ name }) {
        const duplicateCheck = await db.query(`SELECT id FROM brand WHERE name = $1`, [name])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate brand: ${name}`)
        const result = await db.query(`INSERT INTO Brand (name) VALUES ($1) RETURNING id, name`, [name]);
        return result.rows[0];
    }

    static async findAll(){
        let brandRes = await db.query(`SELECT * FROM (
                     SELECT b.id, b.name as name, COUNT(p.id) as product_count
                     FROM brand b
                     LEFT JOIN product p ON b.id = p.brand_id                     
                     GROUP BY b.id, b.name     
                     HAVING COUNT(p.id) >= 3
                     ) subquery                            
                     ORDER BY subquery.product_count DESC; `);
        return brandRes.rows;
    }
  
    static async get(id) {
        const brandRes = await db.query(`SELECT * FROM brand WHERE id = $1`, [id]);
        const brand = brandRes.rows[0];
        if(! brand) throw new NotFoundError(`No brand : ${id}`)

        const productRes = await db.query(
            `SELECT id, product_key, name, price, price_sign, prev_price, image_link, description, rating, number_rating, category_id, type_id
             FROM product WHERE brand_id = $1 ORDER BY id LIMIT ((SELECT COUNT(*) FROM product WHERE brand_id = $1) / 3) * 3`, [id]
        );
        brand.products = productRes.rows
        return brand;
    }
  
    static async update(id, { name }) {
        const result = await db.query(`SELECT * FROM brand WHERE id = $1`,[id])
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No brand : ${name}`)
        const brandRes = await db.query(`UPDATE brand SET name = $2 WHERE id = $1 RETURNING id, name`, [id, name]);
        const brand = brandRes.rows[0];        
        return brand;
    }
  
    static async remove(id) {
        const result = await db.query(`SELECT * FROM brand WHERE id = $1`,[id])
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No brand : ${id}`)
        const brandRes = await db.query(`DELETE FROM Brand WHERE id = $1`,[id]);
        const brand = brandRes.rows[0];        
        return brand;
    }
  }
  
  module.exports = Brand;