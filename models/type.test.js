"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Type = require("./type.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTypeIds,
  testTypes,
  testTypeNames
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newType = {
      name: "New",
      type: "Type"
    };

  test("works", async function () {
    const type = await Type.create(newType);
    
    expect(type.name).toEqual(newType.name);

    const result = await db.query(
          `SELECT id, name, type
           FROM type
           WHERE name = 'New'`);
    expect(result.rows).toEqual([
      { 
        id: expect.any(Number),
        name: "New",
        type: "Type"
      }
    ]);       
  });

  test("bad request with dupe", async function () {
    try {
      await Type.create(newType);
      await Type.create(newType);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
    
})  

/******************** findAll *********************/


describe("findAll", function() {
  test("works findAll", async function() {

    const types = await Type.findAll();
    // Expect the records to match the created records
    expect(types[0]).toEqual({
      id: expect.any(Number),
      name: "Type1",
      type: "Nail"
    });
    expect(types[1]).toEqual({
      id: expect.any(Number),
      name: "Type2",
      type: "Eye"
    });
    expect(types[2]).toEqual({
      id: expect.any(Number),
      name: "Type3",
      type: "Face"
    });
  });
});

/******************** findByType *********************/

describe("findByType", function() {
  test("works findByType", async function() {

    const result = await Type.findByType("Face");
    expect(result).toEqual({
      id: expect.any(Number),
      name: "Type3",
      type: "Face"
    });
  });

  test("returns not found if no such records found", async function() {
    try {
      await Type.findByType("InvalidType");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /****************** get *********************/


describe("get", function () {
  test("works get type details", async function () {
  let testType = testTypes[0];
  let testName = testTypeNames[0];
  let type = await Type.get(testType, testName);
   
    expect(type).toEqual({
      id: expect.any(Number),
      name: 'Type1',
      type: 'Nail',  
      products:[
        { id: expect.any(Number), product_key: 1,  brand_id: expect.any(Number),  name: 'Product1', price: 10, price_sign: '$', prev_price: 9, image_link: 'https://image1.com', 
          description: 'Product1 description', rating: 4.5, number_rating: 100, category_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 2,  brand_id: expect.any(Number), name: 'Product2', price: 20, price_sign: '$', prev_price: 18, image_link: 'https://image2.com', 
          description: 'Product2 description', rating: 4.2, number_rating: 80, category_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 3,  brand_id: expect.any(Number), name: 'Product3', price: 30, price_sign: '$', prev_price: 25, image_link: 'https://image3.com', 
          description: 'Product3 description', rating: 4, number_rating: 60,category_id: expect.any(Number)}
      ]
    });
    expect(type.products.length).toBe(3);
  });

  test("not found if no such name", async function () {
    try {
      let testType = testTypes[0];
      await Type.get(testType, "Nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  test("not found if no such type and name", async function () {
    try {
      await Type.get("Nope", "Nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /**************** update ***********************/

describe("update", () => {
  it("should update the name of a type with a given id", async () => {
    let typeId = testTypeIds[1]
    // update the name and type of the type
    await Type.update(typeId, { name: "Type4", type: "Lips" });
    // fetch the type from the database and check that its name has been updated
    const result = await db.query("SELECT * FROM type WHERE id = $1", [typeId]);
    const type = result.rows[0];

    expect(type).toEqual({
       id: typeId, 
       name: 'Type4', 
      type: 'Lips' 
    })
  });

  test("not found if no such type", async function () {
    try {
      const faketypeId = 12345;
      await Type.update(faketypeId, { name: "Type5", type: "Leg" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /********************remove ****************** */

describe("remove", function () {
  test("works", async function () {
    let typeId = testTypeIds[2]
    await Type.remove(typeId);
    const res = await db.query(
        `SELECT * FROM type WHERE id = $1`,[typeId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such type", async function () {
    try {
      await Type.remove(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});