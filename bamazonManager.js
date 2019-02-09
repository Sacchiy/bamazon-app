var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'Kona2014',
    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // queryAllProducts();
});

function promptUserInput() {
    inquirer.prompt({
        type: "list",
        name: "filter",
        message: "What would you like to do?",
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (input) {
        console.log("User selected: " + input.filter);

        if (input.filter == "View Products for Sale") {
            viewProducts();

        } else if (input.filter == "View Low Inventory") {
            viewLowInventry();

        } else if (input.filter == "Add to Inventory") {
            addInventory();
        } else if (input.filter == "Add New Product") {
            addNewProduct();
        }
    }
    )
}

promptUserInput();

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------")
    });
};

function viewLowInventry() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------")
    });
};

function addInventory() {
    inquirer.prompt({
        type: "list",
        name: "addInventory",
        message: "Which item would you like to add inventory to?",
        choices: ["1","2","3","4","5","6","7","8","9","10"]

    }).then(function (input) {
        console.log("Updating inventory...\n");
        var query = connection.query(
            "UPDATE products SET quantity=? WHERE id=?", [100, input.addInventory],
            function (err, res) {
                console.log(res.affectedRows + " products updated!\n");
                // Call deleteProduct AFTER the UPDATE completes
                deleteProduct();
            }
        );
        console.log(query.sql);
        })
    };

    function addNewProduct() {
        console.log("Inserting a new product...\n");
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: "",
                price: "",
                stock_quantity: ""
            },
            function (err, res) {
                console.log(" product inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                //updateProduct();
            }
        );
        console.log(query.sql);
    };

   //  connection.query(queryStr, { artist: input.artist }, function (err, data) {
   //         if (err) throw err;
   //         for (var i = 0; i < data.length; i++) {
   //             console.log("Artist: " + data[i].artist, "Song Name: " + data[i].song, "Year: " + data[i].year);
   //         };
    //    })