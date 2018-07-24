//=================================Setup Required Variables===============================

var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

//=================================Connect to SQL database===============================

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//=================================Inquirer introduction===============================

function startPrompt() {

    inquirer.prompt([{
        name: "actionList",
        type: "list",
        message: "Welcome Manager. What would you like to review?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]

    }]).then(function(user) {
        if (user.actionList === "View Products For Sale") {
            inventoryView();
        } else if (user.actionList === "View Low Inventory") {
            lowInventory();
        } else if (user.actionList === "Add To Inventory") {
            addInventory();
        } else {
            addProduct();
        }
    });
}

//=================================View Inventory===============================

function inventoryView() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    function listInventory() {

        //Variable creation from DB connection

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
            console.log("");
            console.log("====================================================== Current Bamazon Inventory ======================================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            startPrompt();
        });
    }
}

//=================================View Low Inventory===============================

//Connect to database to show any inventory with less than 5 in stock quantity

function lowInventory() {
    // instantiate
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listLowInventory();

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    function listLowInventory() {

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                //check if any of the stock_quantity equals 5 or less

                if (res[i].stock_quantity <= 5) {

                    var itemId = res[i].item_id,
                        productName = res[i].product_name,
                        departmentName = res[i].department_name,
                        price = res[i].price,
                        stockQuantity = res[i].stock_quantity;

                    table.push(
                        [itemId, productName, departmentName, price, stockQuantity]
                    );
                }
            }
            console.log("");
            console.log("============================================= Low Bamazon Inventory (5 or Less in Stock) ===============================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            startPrompt();
        });
    }
}

//=================================Add Inventory===============================

function addInventory() {

    inquirer.prompt([{
            name: "inputId",
            type: "input",
            message: "Please enter the ID number of the item you would like to add inventory to.",
        },
        {
            name: "inputNumber",
            type: "input",
            message: "How many units of this item would you like to have in the in-store stock quantity?",

        }
    ]).then(function(managerAdd) {

              connection.query("UPDATE products SET ? WHERE ?", [{

                  stock_quantity: managerAdd.inputNumber
              }, {
                  item_id: managerAdd.inputId
              }], function(err, res) {
              });
          startPrompt();
        });
      }


//=================================Add New Product===============================

function addProduct() {

//ask user to fill in all necessary information to fill columns in table

    inquirer.prompt([{
            name: "inputName",
            type: "input",
            message: "Please enter the item name of the new product.",
        },
        {
            name: "inputDepartment",
            type: "input",
            message: "Please enter which department name of which the new product belongs.",
        },
        {
            name: "inputPrice",
            type: "input",
            message: "Please enter the price of the new product (0.00).",
        },
        {
            name: "inputStock",
            type: "input",
            message: "Please enter the stock quantity of the new product.",
        }

    ]).then(function(managerNew) {

      //connect to database, insert column data with input from user

      connection.query("INSERT INTO products SET ?", {
        product_name: managerNew.inputName,
        department_name: managerNew.inputDepartment,
        price: managerNew.inputPrice,
        stock_quantity: managerNew.inputStock
      }, function(err, res) {});
      startPrompt();
    });
}