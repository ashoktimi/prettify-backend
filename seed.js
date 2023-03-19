
const axios = require('axios');
const db = require('./db');

async function getData() {
  try {
    // Retrieve data from API
    const response = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json');
     // Retrieve brand data    
    const brandNames = [...new Set(response.data.map(item => item.brand))];
    const filteredBrandNames = brandNames.filter(Boolean); // removes null, undefined and empty strings
     // Insert brand
    for(let brandName of filteredBrandNames){
      await db.query(`INSERT INTO brand (name) VALUES ($1) RETURNING name`,[brandName])
    }
    // Retrieve category data  
    const categoryNames = [...new Set(response.data.map(item => item.category))];
    const filteredCategoryNames = categoryNames.filter(Boolean);
    // Insert category  
    for(let categoryName of filteredCategoryNames){
      await db.query(`INSERT INTO category (name) VALUES ($1) RETURNING name`,[categoryName])
    }
    // Retrieve types data  
    const Tpyes = [...new Set(response.data.map(item => item.product_type))];
    const filteredTypes = Tpyes.filter(Boolean);
    // Insert product_types 
    for(let typeName of filteredTypes){
      await db.query(`INSERT INTO type (name) VALUES ($1) RETURNING name`,[typeName])
    }
    // insert TagList 
    const uniqueTags = new Set();
    response.data.forEach(product => {
      product.tag_list.forEach(tag => {
        uniqueTags.add(tag);
      });
    });
    // Insert unique tag_list values into TagList table
    const insertQuery = 'INSERT INTO TagList (name) VALUES ($1)';
    uniqueTags.forEach(tag => {
      db.query(insertQuery, [tag], (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Inserted tag "${tag}" into TagList table`);
      });
    });

    // Insert products
    response.data.map(async (product) => {
      await db.query(
        `INSERT INTO product 
        (product_key, name, description, price, price_sign, image_link, product_link, website_link, rating, created_at, updated_at, brand_id, category_id, product_type_id) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
         (SELECT id FROM brand WHERE name = $12), 
         (SELECT id FROM category WHERE name = $13),
         (SELECT id FROM product_type WHERE name = $14))`,
      [product.id, product.name, product.description, product.price, product.price_sign, product.image_link, product.product_link, product.website_link, product.rating, product.created_at, 
        product.updated_at, product.brand, product.category, product.product_type]
      )
    });

    // insert TagList_Product
    for (const product of response.data) {
      const productId = product.id;
      for (const tag of product.tag_list ){      
        await db.query(`INSERT INTO taglist_product (tagList_id, product_id)
          VALUES ((SELECT id FROM taglist WHERE name = $1),
            (SELECT id FROM product WHERE product_key = $2))`,
            [tag, productId]);
      }};

    // Insert colors
    for (const product of response.data) {
      const productId = product.id;
      for (const color of product.product_colors) {
        const hexValue = color.hex_value;
        const colorName = color.colour_name;      
        await db.query(`
          INSERT INTO color (hex_value, color_name, product_id)
          VALUES ($1, $2, 
            (SELECT id FROM product WHERE product_key = $3))`,
            [hexValue, colorName, productId]);
      }};

  } 
    catch (error) {
    console.error(error);
  }
  console.log("done")
}

getData();
