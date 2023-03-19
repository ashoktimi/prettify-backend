
CREATE TABLE brand (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  type VARCHAR(50)
);

CREATE TABLE tagList (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
)

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  product_key INTEGER,
  brand_id INTEGER REFERENCES brand(id) ON DELETE CASCADE,
  name VARCHAR(255),
  price FLOAT,
  price_sign VARCHAR(10),
  image_link VARCHAR(500),
  product_link VARCHAR(500),
  website_link VARCHAR(500),
  description VARCHAR(10000),
  rating FLOAT,
  number_rating INTEGER,
  category_id INTEGER REFERENCES category(id) ON DELETE CASCADE,
  type_id INTEGER REFERENCES product_type(id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE product_color (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
  hex_value VARCHAR(100),
  color_name VARCHAR(250)
);

CREATE TABLE taglist_product (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
  tagList_id INTEGER REFERENCES taglist(id) ON DELETE CASCADE,
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  product_id INTEGER REFERENCES Product(id) ON DELETE CASCADE,
  quantity INTEGER
)



