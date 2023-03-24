"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Brand = require("./brand.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBrandIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newBrand = {
      name: "New",
    };

  test("works", async function () {
    let brand = await Brand.create(newBrand);
    
    expect(brand.name).toEqual(newBrand.name);

    const result = await db.query(
          `SELECT id, name
           FROM brand
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
      await Brand.create(newBrand);
      await Brand.create(newBrand);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
    
})  

/******************** findAll *********************/

describe("findAll", function () {
  test("works: all", async function () {
    let brands = await Brand.findAll();

    expect(brands).toContainEqual({
      id: expect.any(Number),
      name: "Brand1",
      product_count: expect.any(String)
    });

    expect(brands).toContainEqual({
      id: expect.any(Number),
      name: "Brand2",
      product_count: expect.any(String)
    });

    expect(brands).toContainEqual({
      id: expect.any(Number),
      name: "Brand3",
      product_count: expect.any(String)
    });
  });
});


/*****************get********************* */

describe("get", function () {
  test("works", async function () {
    let brandIds = testBrandIds[0]
    let brand = await Brand.get(brandIds);
    expect(brand).toEqual({
      id: brandIds,
      name: "Brand1",  
      products:[
        { id: expect.any(Number), product_key: 1, name: 'Product1', price: 10, price_sign: '$', prev_price: 9, image_link: 'https://image1.com', 
          description: 'Product1 description', rating: 4.5, number_rating: 100, category_id: expect.any(Number), type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 2, name: 'Product2', price: 20, price_sign: '$', prev_price: 18, image_link: 'https://image2.com', 
          description: 'Product2 description', rating: 4.2, number_rating: 80, category_id: expect.any(Number), type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 3, name: 'Product3', price: 30, price_sign: '$', prev_price: 25, image_link: 'https://image3.com', 
          description: 'Product3 description', rating: 4, number_rating: 60,category_id: expect.any(Number), type_id: expect.any(Number)}
      ]
    });
    expect(brand.products.length).toBe(3);
  });

  test("not found if no such brand", async function () {
    try {
      await Brand.get(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/**************** update ***********************/

describe("update", () => {
  it("should update the name of a brand with a given id", async () => {
    let brandId = testBrandIds[1]
    // update the name of the brand
    await Brand.update(brandId, { name: "Adidas" });

    // fetch the brand from the database and check that its name has been updated
    const result = await db.query("SELECT * FROM brand WHERE id = $1", [brandId]);
    const brand = result.rows[0];
    expect(brand.name).toBe("Adidas");
  });

  test("not found if no such brand", async function () {
    try {
      const fakeBrandId = 12345;
      await Brand.update(fakeBrandId, { name: "New Name" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/********************remove ****************** */

describe("remove", function () {
  test("works", async function () {
    let brandId = testBrandIds[2]
    await Brand.remove(brandId);
    const res = await db.query(
        `SELECT * FROM brand WHERE id = $1`,[brandId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such brand", async function () {
    try {
      await Brand.remove(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});