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
    inquirer.prompt([
        {
        type: "input",
        name: "addInventory",
        message: "Which item would you like to add inventory to?",
        },
        {
        type: "input",
        name: "inventoryToAdd",
        message: "Enter the quantity you wish to add",
        }

    ]).then(function (answer) {
        console.log("Updating inventory...\n");
        connection.query('SELECT * FROM products WHERE ?', {id: answer.id},function(err,res) {
            itemQuantity = res[0].stock_quantity + parseInt(answer.inventoryToAdd);
        connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: itemQuantity
                },
                { 
                    id: answer.id
                }
            ],
            function (err, res) {
                console.log(input.addInventory + " products updated!\n");
                // Call deleteProduct AFTER the UPDATE completes
            });
            connection.query('SELECT * FROM products WHERE ?', {id: answer.id},function(err,results) {
                console.log('\n The Stock Quantity was updated- see Inventory Table\n');   
                displayForManager(results);
            });
        });
    });
};
    // Add a new product into the database with all of it's information, display the Inventory Table, prompt Manager if desires to continue
function addNewProduct() {
    inquirer.prompt([{
        name: "productName",
        type: "input",
        message: " Enter the name of the product",
    }, {
        name: "departmentName",
        type: "input",
        message: " Enter the department of the product",
    }, {
        name: "price",
        type: "input",
        message: " Enter price of the product",
    }, {
        name: "quantity",
        type: "input",
        message: " Enter the quantity",                
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function(err, res) {
            console.log('\n  The new product was added - See the Inventory Table\n');
                connection.query('SELECT * FROM products', function(err, results){  
                    displayForManager(results);
                });               
        }); 
    });
};
    // Displays Inventory Table for Manager, Results from a SELECT query are passed in as parameter and used 
    var displayForManager = function(results) {   
    var display = new displayTable();
    display.displayInventoryTable(results);
}
Table = require('cli-table2');

var displayTable = function() {

    this.table = new Table({
        head: ['id', 'product_name', 'price', 'stock_quantity'],
    });
    this.displayInventoryTable = function(results) {
    	this.results = results;
	    for (var i=0; i <this.results.length; i++) {
	        this.table.push(
	            [this.results[i].id, this.results[i].product_name, '$'+ this.results[i].price, this.results[i].stock_quantity] );
	    }
    	console.log('\n' + this.table.toString());
	};
}
   //  connection.query(queryStr, { artist: input.artist }, function (err, data) {
   //         if (err) throw err;
   //         for (var i = 0; i < data.length; i++) {
   //             console.log("Artist: " + data[i].artist, "Song Name: " + data[i].song, "Year: " + data[i].year);
   //         };
    //    })