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
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        promptUserInput();
    });
};

function promptUserInput() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the id of the product you would like to buy?",
        },
        {
            name: "unit",
            type: "input",
            message: "How many units of this product would you like to buy?",
        }
    ]).then(function (answer) {
        console.log(answer.id);
        console.log(answer.unit);
        var queryStr = "SELECT stock_quantity, price FROM products WHERE item_id=?";
        connection.query(queryStr, answer.id, function (err, data) {
            if (err) throw err;
            for (var i = 0; i < data.length; i++) {
                console.log("Stock Quantity: " + data[i].stock_quantity);
                if (answer.unit <= data[i].stock_quantity) {
                    var newStock = data[i].stock_quantity - answer.unit;
                    var total = data[i].price * answer.unit;
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: answer.id
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("Your order has been completed! Total: " + total);
                            // re-prompt the user for if they want to bid or post
                        }
                    );
                } else {
                    console.log("Insufficient quantity! Your order did not go through");
                };
            };
        });
    });
};

