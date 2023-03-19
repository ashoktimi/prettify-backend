"use strict";

const db = require("../db");
const {  NotFoundError } = require("../expressError");


class Cart {
    static async get({ username }) {
      const userRes = await db.query(
        `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"
         FROM users
         WHERE username = $1`,
      [username],
    );
  const user = userRes.rows[0];

  if (!user) throw new NotFoundError(`No user: ${username}`);
    const result = await db.query(`
      SELECT p.id, p.product_key, p.brand_id, p.name, p.price, p.price_sign,
        p.image_link, p.product_link, p.website_link, p.description,
        p.rating, p.number_rating, p.category_id, p.type_id,
        p.created_at, p.updated_at, c.quantity
      FROM cart c
      JOIN product p ON c.product_id = p.id
      WHERE c.username = $1
    `, [username]);

    return result.rows;
  }
}

module.exports = Cart;