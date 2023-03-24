const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testBrandIds =[];
const testCategoryIds=[];
const testTagIds=[];
const testTypeIds=[];
const testTypes=[];
const testTypeNames=[];
const testProductIds = [];


//   // Insert data into the users table
//   await db.query(`
//         INSERT INTO users(username,
//                           password,
//                           first_name,
//                           last_name,
//                           email)
//         VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
//                ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
//         RETURNING username`,
//       [
//         await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
//         await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
//       ]);

async function commonBeforeAll() {
  await db.query("DELETE FROM brand");
  await db.query("DELETE FROM category");
  await db.query("DELETE FROM product");
  await db.query("DELETE FROM tagList");
  await db.query("DELETE FROM taglist_product");
  await db.query("DELETE FROM type");

const resultsBrand = await db.query(`
  INSERT INTO brand(name) 
  VALUES ('Brand1'), ('Brand2'), ('Brand3')
  RETURNING id, name`);
const brandIds = resultsBrand.rows.map(r => r.id);
testBrandIds.splice(0, 0, ...resultsBrand.rows.map(r => r.id));

const resultsCategory = await db.query(`
  INSERT INTO category(name)
  VALUES ('Category1'), ('Category2'), ('Category3')
  RETURNING id`);
const categoryIds = resultsCategory.rows.map(r => r.id);
testCategoryIds.splice(0, 0, ...resultsCategory.rows.map(r => r.id));

const resultsType = await db.query(`
  INSERT INTO type(name, type)
  VALUES ('Type1', 'Nail'), ('Type2', 'Eye'), ('Type3', 'Face')
  RETURNING id, name, type`);
const typeIds = resultsType.rows.map(r => r.id);
testTypeIds.splice(0, 0, ...resultsType.rows.map(r => r.id));
testTypes.splice(0, 0, ...resultsType.rows.map(r => r.type));
testTypeNames.splice(0, 0, ...resultsType.rows.map(r => r.name));


const resultProducts = await db.query(`
  INSERT INTO product (product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating, number_rating, category_id, type_id)
  VALUES 
  (1, $1, 'Product1', 10.0, '$', 9.0, 'https://image1.com',  'Product1 description', 4.5, 100, $4, $7),
  (2, $1, 'Product2', 20.0, '$', 18.0, 'https://image2.com', 'Product2 description', 4.2, 80, $4, $7),
  (3, $1, 'Product3', 30.0, '$', 25.0, 'https://image3.com', 'Product3 description', 4.0, 60, $4, $7),
  (4, $2, 'Product4', 15.0, '$', 12.0, 'https://image4.com', 'Product4 description', 3.8, 50, $5, $8),
  (5, $2, 'Product5', 25.0, '$', 22.0, 'https://image5.com', 'Product5 description', 4.1, 90, $5, $8),
  (6, $2, 'Product6', 35.0, '$', 30.0, 'https://image6.com', 'Product6 description', 4.3, 120, $5,$8),
  (7, $3, 'Product7', 12.0, '$', 10.0, 'https://image7.com', 'Product7 description', 4.6, 150, $6, $9),
  (8, $3, 'Product8', 22.0, '$', 20.0, 'https://image8.com', 'Product8 description', 4.4, 200, $6, $9),
  (9, $3, 'Product9', 32.0, '$', 28.0, 'https://image9.com', 'Product9 description', 4.2, 180, $6, $9)
  RETURNING id`
  ,[brandIds[0], brandIds[1], brandIds[2], categoryIds[0], categoryIds[1], categoryIds[2], typeIds[0], typeIds[1], typeIds[2]])

  const productIds = resultProducts.rows.map(r => r.id);
  testProductIds.splice(0, 0, ...resultProducts.rows.map(r => r.id));




  const resultsTags = await db.query(`
  INSERT INTO tagList(name)
  VALUES ('Tag1'), ('Tag2'), ('Tag3')
  RETURNING id`);
const tagsIds = resultsTags.rows.map(r => r.id);
testTagIds.splice(0, 0, ...resultsTags.rows.map(r => r.id));

await db.query(`INSERT INTO taglist_product (taglist_id, product_id) 
  VALUES
  ($1, $2), ($1, $3), ($1, $4), ($5, $6), ($5, $7), ($5, $8), ($9, $10), ($9, $11), ($9, $12)`,
  [tagsIds[0], productIds[0], productIds[1], productIds[2], tagsIds[1], productIds[3], productIds[4], productIds[5], tagsIds[2], productIds[6], productIds[7], productIds[8]
 ])
}

async function commonBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function commonAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function commonAfterAll() {
    await db.end();
  }
  
module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testBrandIds,
    testCategoryIds,
    testTagIds,
    testTypeIds,
    testTypes,
    testTypeNames,
    testProductIds
};
  