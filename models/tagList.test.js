"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const TagList = require("./tagList.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTagIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newtag = {
      name: "New",
    };

  test("works", async function () {
    let tag = await TagList.create(newtag);
    
    expect(tag.name).toEqual(newtag.name);

    const result = await db.query(
          `SELECT id, name
           FROM tagList
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
      await TagList.create(newtag);
      await TagList.create(newtag);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
    
})  

// /******************** findAll *********************/

describe("findAll", function () {
  test("works: all", async function () {
    let tags = await TagList.findAll();

    expect(tags).toContainEqual({
      id: expect.any(Number),
      name: "Tag1",
      product_count: expect.any(String)
    });

    expect(tags).toContainEqual({
      id: expect.any(Number),
      name: "Tag2",
      product_count: expect.any(String)
    });

    expect(tags).toContainEqual({
      id: expect.any(Number),
      name: "Tag3",
      product_count: expect.any(String)
    });
  });
});


// /************** get *************************/

describe("get", function () {
  test("works", async function () {
    let tagId = testTagIds[0]
    let tag = await TagList.get(tagId);

    expect(tag).toEqual({
      id: tagId,
      name: "Tag1",  
      products:[
        { id: expect.any(Number), product_key: 1, brand_id: expect.any(Number), name: 'Product1', price: 10, price_sign: '$', prev_price: 9, image_link: 'https://image1.com', 
          description: 'Product1 description', rating: 4.5, number_rating: 100, category_id: expect.any(Number), type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 2, brand_id: expect.any(Number), name: 'Product2', price: 20, price_sign: '$', prev_price: 18, image_link: 'https://image2.com', 
          description: 'Product2 description', rating: 4.2, number_rating: 80, category_id: expect.any(Number), type_id: expect.any(Number)},
        { id: expect.any(Number), product_key: 3, brand_id: expect.any(Number), name: 'Product3', price: 30, price_sign: '$', prev_price: 25, image_link: 'https://image3.com', 
          description: 'Product3 description', rating: 4, number_rating: 60,category_id: expect.any(Number), type_id: expect.any(Number)}
      ]
    });
    expect(tag.products.length).toBe(3);
  });

  test("not found if no such tags", async function () {
    try {
      await TagList.get(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /**************** update ***********************/

describe("update", () => {
  it("should update the name of a tags with a given id", async () => {
    let tagId = testTagIds[1]
    // update the name of the tags
    await TagList.update(tagId, { name: "Tag4" });

    // fetch the tags from the database and check that its name has been updated
    const result = await db.query("SELECT * FROM tagList WHERE id = $1", [tagId]);
    const tags = result.rows[0];
    expect(tags.name).toBe("Tag4");
  });

  test("not found if no such tags", async function () {
    try {
      const faketagsId = 12345;
      await TagList.update(faketagsId, { name: "New Name" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


// /********************remove ****************** */

describe("remove", function () {
  test("works", async function () {
    let tagId = testTagIds[2]
    await TagList.remove(tagId);
    const res = await db.query(
        `SELECT * FROM tagList WHERE id = $1`,[tagId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such tags", async function () {
    try {
      await TagList.remove(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});