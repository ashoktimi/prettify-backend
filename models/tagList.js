"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class TagList {
    static async create({ name }) {
        const duplicateCheck = await db.query(`SELECT id FROM taglist WHERE name = $1`, [name])
        if (duplicateCheck.rows[0])
          throw new BadRequestError(`Duplicate taglist: ${name}`)
        const result = await db.query(`INSERT INTO taglist (name) VALUES ($1) RETURNING id, name`, [name]);
        return result.rows[0];
    }

    static async findAll(){
        let tagListRes = await db.query(`SELECT * FROM (
             SELECT t.id, t.name AS name, COUNT(tp.product_id) AS product_count
             FROM taglist t
             LEFT JOIN taglist_product tp ON t.id = tp.taglist_id
             GROUP BY t.id, t.name
             HAVING COUNT(tp.id) >= 3
             ) subquery
             ORDER BY subquery.product_count DESC; `);
        return tagListRes.rows;
    }
  

    static async get(id) {
        const taglistRes = await db.query(`SELECT * FROM taglist WHERE id = $1`, [id]);
        const taglist = taglistRes.rows[0];
        if(! taglist) throw new NotFoundError(`No taglist : ${id}`)
        
        const productRes = await db.query(
            `SELECT p.id, p.product_key, p.brand_id, p.name, p.price, p.price_sign, prev_price, p.image_link, p.description, p.rating, p.number_rating, p.category_id, p.type_id
             FROM product p
             JOIN taglist_product tp ON p.id = tp.product_id
             JOIN taglist t ON tp.taglist_id = t.id
             WHERE t.id = $1 ORDER BY p.id LIMIT ((SELECT COUNT(*) FROM product p JOIN taglist_product tp ON p.id = tp.product_id WHERE tp.taglist_id = $1) / 3) * 3`, [id]
        );
        

        taglist.products = productRes.rows
        return taglist;
    }
  
    static async update(id, { name }) {
        const result = await db.query(`SELECT * FROM taglist WHERE id = $1`,[id])
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No taglist : ${name}`)
        const taglistRes = await db.query(`UPDATE taglist SET name = $2 WHERE id = $1 RETURNING id, name`, [id, name]);
        const taglist = taglistRes.rows[0];        
        return taglist;
    }
  
    static async remove(id) {
        const result = await db.query(`SELECT * FROM taglist WHERE id = $1`,[id])
        const res = result.rows[0];
        if(!res) throw new NotFoundError(`No taglist : ${id}`)
        const taglistRes = await db.query(`DELETE FROM taglist WHERE id = $1`,[id]);
        const taglist = taglistRes.rows[0];        
        return taglist;
    }
  }
  
  module.exports = TagList;































// "use strict";

// const db = require("../db");
// const { BadRequestError, NotFoundError } = require("../expressError");


// class TagList {
//     static async create({ productId, TagName }) {
//         const duplicateCheck = await db.query(`SELECT id FROM Tag_List WHERE product_id = $1 AND tag_name = $2`, [productId, TagName])
//         if (duplicateCheck.rows[0])
//           throw new BadRequestError(`Duplicate TagList: ${TagName}`)
//         const result = await db.query(`INSERT INTO Tag_List (tag_name, product_id) VALUES ($1, $2) RETURNING id, product_id, tag_name`, 
//             [TagName, productId]);
//         return result.rows[0];
//     }

//     static async findAll(){
//         let query = await db.query(`SELECT * FROM Tag_List`);
//         return query.rows;
//     }
  
//     static async remove(id) {
//         const result = await db.query(`SELECT * FROM Tag_List WHERE id = $1`,[id])
//         const res = result.rows[0];
//         if(!res) throw new NotFoundError(`No TagList : ${id}`)
//         const TagListRes = await db.query(`DELETE FROM Tag_List WHERE id = $1`,[id]);
//         const TagList = TagListRes.rows[0];        
//         return TagList;
//     }
//   }
  
//   module.exports = TagList;