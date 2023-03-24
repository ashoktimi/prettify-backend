"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Category = require("./category.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testCategoryIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newCategory = {
      name: "New",
    };

  test("works", async function () {
    let category = await Category.create(newCategory);
    
    expect(category.name).toEqual(newCategory.name);

    const result = await db.query(
          `SELECT id, name
           FROM category
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      { 
        id: expect.any(Number),
        name: "New"
      },
    ]);       
  });

  test("bad request with dupe", async function () {
    try {
      await Category.create(newCategory);
      await Category.create(newCategory);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
    
})  

/******************** findAll *********************/

describe("findAll", function () {
  test("works: all", async function () {
    let categories = await Category.findAll();

    expect(categories).toContainEqual({
      id: expect.any(Number),
      name: "Category1",
      product_count: expect.any(String)
    });

    expect(categories).toContainEqual({
      id: expect.any(Number),
      name: "Category2",
      product_count: expect.any(String)
    });

    expect(categories).toContainEqual({
      id: expect.any(Number),
      name: "Category3",
      product_count: expect.any(String)
    });
  });
});


// /******************* get ********************/

describe("get", function () {
  test("works", async function () {
    let categoryId = testCategoryIds[0]
    let category = await Category.get(categoryId);
    expect(category).toEqual({
      id: categoryId,
      name: "Category1",  
      products:[
        { id: expect.any(Number), product_key: 1, brand_id: expect.any(Number), name: 'Product1', price: 10, price_sign: '$', prev_price: 9, image_link: 'https://image1.com', 
          description: 'Product1 description', rating: 4.5, number_rating: 100,  type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 2, brand_id: expect.any(Number), name: 'Product2', price: 20, price_sign: '$', prev_price: 18, image_link: 'https://image2.com', 
          description: 'Product2 description', rating: 4.2, number_rating: 80, type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 3, brand_id: expect.any(Number), name: 'Product3', price: 30, price_sign: '$', prev_price: 25, image_link: 'https://image3.com', 
          description: 'Product3 description', rating: 4, number_rating: 60, type_id: expect.any(Number)}
      ]
    });
    expect(category.products.length).toBe(3);
  });

  test("not found if no such Categories", async function () {
    try {
      await Category.get(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /**************** update ***********************/

describe("update", () => {
  it("should update the name of a Categories with a given id", async () => {
    let categorysId = testCategoryIds[1]
    // update the name of the Categories
    await Category.update(categorysId, { name: "Category4" });

    // fetch the category from the database and check that its name has been updated
    const result = await db.query("SELECT * FROM category WHERE id = $1", [categorysId]);
    const category = result.rows[0];
    expect(category.name).toBe("Category4");
  });

  test("not found if no such Categories", async function () {
    try {
      const fakeCategoryId = 12345;
      await Category.update(fakeCategoryId, { name: "New Name" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /********************remove ****************** */

describe("remove", function () {
  test("works", async function () {
    let categoryId = testCategoryIds[2]
    await Category.remove(categoryId);
    const res = await db.query(
        `SELECT * FROM category WHERE id = $1`,[categoryId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such Categories", async function () {
    try {
      await Category.remove(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});