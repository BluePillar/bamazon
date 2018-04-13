var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  })

  connection.connect(function(err) {
    if (err) throw err
    listItems()
    inquirer.createPromptModule()
})

buyProduct()

// connection.end(function (e) {
//     if (e) throw e
//   })

  function listItems () {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err    
        console.log("==============================================");
        console.log(res)
        console.log("==============================================");
    })
  }

  function buyProduct () {
    inquirer.prompt([
        
        {
          type: "input",
          name: "productID",
          message: "Please enter the 'ID' of the product you are interested in purchasing: "
        },
      
        {
          type: "input",
          name: "productQTY",
          message: "How many would you like to buy? "
        }
      
    ]).then(function(selection) {
        var query = 'SELECT stock_quantity FROM products WHERE id=' + selection.productID + ' AND stock_quantity >= ' + selection.productQTY + ';'
        connection.query(query, function(err, res) {
            if (err) {
                throw err
                console.log('Insufficient Quantity!')
            }    
            makePurchase()
        })
      
    })
  }

  function makePurchase () {
      updateQuantity()
      showTotal()
  }