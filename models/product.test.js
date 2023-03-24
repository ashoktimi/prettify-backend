"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Product = require("./product.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBrandIds,
  testCategoryIds,
  testTypeIds,
  testProductIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
  test("works", async function () {
    const newproduct = {
        productKey: 1515, 
        brandId: testBrandIds[0],
        name: "testProduct", 
        price: 15, 
        priceSign: "$", 
        prevPrice: 17, 
        imageLink: 'https://image10.com', 
        description: "testProduct description", 
        rating: 3.4,  
        numberRating: 120, 
        categoryId: testCategoryIds[0], 
        typeId: testTypeIds[0]
    };
    let product = await Product.create(newproduct);
    
    expect(product.name).toEqual(newproduct.name);

    const result = await db.query(
        `SELECT id, product_key, brand_id, name, price, price_sign, prev_price, image_link, description, rating,  number_rating, category_id, type_id
           FROM product
           WHERE name = 'testProduct'`);
    expect(result.rows).toEqual([
        {
            id: expect.any(Number),
            product_key: 1515,
            brand_id: testBrandIds[0],
            name: 'testProduct',
            price: 15,
            price_sign: '$',
            prev_price: 17,
            image_link: 'https://image10.com',
            description: 'testProduct description',
            rating: 3.4,
            number_rating: 120,
            category_id: testCategoryIds[0], 
            type_id: testTypeIds[0]
          }
    ]);       
  });

  test("bad request with dupe", async function () {
    const newproduct = {
        productKey: 1515, 
        brandId: testBrandIds[0],
        name: "testProduct", 
        price: 15, 
        priceSign: "$", 
        prevPrice: 17, 
        imageLink: 'https://image10.com', 
        description: "testProduct description", 
        rating: 3.4,  
        numberRating: 120, 
        categoryId: testCategoryIds[0], 
        typeId: testTypeIds[0]
    };
    try {
      await Product.create(newproduct);
      await Product.create(newproduct);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });    
})  

/******************** findAll *********************/

describe("findAll", function () {
  test("works: all", async function () {
    let products = await Product.findAll();
    expect(products).toContainEqual({
        id: expect.any(Number),
        product_key: 1,
        brand_id:  expect.any(Number),
        name: 'Product1',
        price: 10,
        price_sign: '$',
        prev_price: 9,
        image_link: 'https://image1.com',
        description: 'Product1 description',
        rating: 4.5,
        number_rating: 100,
        category_id:  expect.any(Number),
        type_id:  expect.any(Number)
    });

    expect(products).toContainEqual({
        id: expect.any(Number),
        product_key: 2,
        brand_id:   expect.any(Number),
        name: 'Product2',
        price: 20,
        price_sign: '$',
        prev_price: 18,
        image_link: 'https://image2.com',
        description: 'Product2 description',
        rating: 4.2,
        number_rating: 80,
        category_id:  expect.any(Number),
        type_id:  expect.any(Number)
    });

    expect(products).toContainEqual({
        id: expect.any(Number),
        product_key: 3,
        brand_id:   expect.any(Number),
        name: 'Product3',
        price: 30,
        price_sign: '$',
        prev_price: 25,
        image_link: 'https://image3.com',
        description: 'Product3 description',
        rating: 4,
        number_rating: 60,
        category_id:  expect.any(Number),
        type_id:  expect.any(Number)
    });
  });

  test("works: by name", async function () {
    let products = await Product.findAll({ name: "product1" });
    expect(products).toEqual([
      {
        id: expect.any(Number),
        product_key: 1,
        brand_id:  expect.any(Number),
        name: 'Product1',
        price: 10,
        price_sign: '$',
        prev_price: 9,
        image_link: 'https://image1.com',
        description: 'Product1 description',
        rating: 4.5,
        number_rating: 100,
        category_id:  expect.any(Number),
        type_id:  expect.any(Number)
      },
    ]);
  });
});


// /*****************get **********************/

describe("get", function () {
  test("works", async function () {
    let productIds = testProductIds[0]
    let product = await Product.get(productIds);

    expect(product).toEqual({
        id: productIds,
        product_key: 1,
        brand_id: expect.any(Number),
        name: 'Product1',
        price: 10,
        prev_price: 9,
        price_sign: '$',
        image_link: 'https://image1.com',
        description: 'Product1 description',
        rating: 4.5,
        number_rating: 100,
        category_id: expect.any(Number),
        type_id: expect.any(Number),
        colors: []
    });
  });

  test("not found if no such product", async function () {
    try {
      await Product.get(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /**************** update ***********************/

describe("update", function () {
 test("works for update", async function () {
    let productIds = testProductIds[6]
    const updateData = {    
       productKey: 125,
       brandId: testBrandIds[0],
       name: "testProduct", 
       price: 15, 
       priceSign: "$", 
       prevPrice: 17, 
       imageLink: 'https://image10.com', 
       description: "testProduct description", 
       rating: 3.4,  
       numberRating: 120, 
       categoryId: testCategoryIds[0], 
       typeId: testTypeIds[0]
    }
    let product = await Product.update(productIds, updateData)
    expect(product).toEqual({
        id: expect.any(Number),
        product_key: 125,
        brand_id: expect.any(Number),
        name: "testProduct", 
        price: 15,
        prev_price: 17,
        price_sign: '$',
        image_link: 'https://image10.com',
        description: 'testProduct description',
        rating: 3.4,
        number_rating: 120,
        category_id: expect.any(Number),
        type_id: expect.any(Number)
    })
})
  test("not found if no such product", async function () {
    try {
      const fakeproductId = 12345;
      await Product.update(fakeproductId, { name: "New Name" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /********************remove ****************** */

describe("remove", function () {
  test("works", async function () {
    let productId = testProductIds[2]
    await Product.remove(productId);
    const res = await db.query(
        `SELECT * FROM product WHERE id = $1`,[productId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such product", async function () {
    try {
      await Product.remove(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});