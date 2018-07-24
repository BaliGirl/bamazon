CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);

Select * from products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad Pro", "Electronics", 750.00, 10),
("XBox 1", "Electronics", 399.99, 8),
("Keurig", "Kitchen", 45.00, 15),
("Pokemon Cards", "Games", 15.00, 100),
("'The Beatles' Vinyl Record", "Music", 100.00, 5),
("Mountain Bike", "Outdoors", 7500.00, 75),
("Tent", "Camping", 80.00, 40),
("Diamond Rings", "Jewelry", 10000.00, 20),
("iPhone X Case", "Electronics", 55.99, 61),
("Decoration Pillows", "Home", 29.99, 72),
("Tennis Racquet", "Sport", 189.99, 97);