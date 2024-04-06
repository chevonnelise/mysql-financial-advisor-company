const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const { createConnection } = require('mysql2/promise');
require('dotenv').config();

let app = express();

// set up the view engine
app.set('view engine', 'hbs');

require('handlebars-helpers')({
    handlebars: hbs.handlebars
})
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({
    extended: false
}));

// wax-on (template inheritance)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    // console.log(process.env);
    const connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/customers', async function (req, res) {

        const {search} = req.query;
        console.log(search);
        let [customers] = !search?await connection.execute(`
        SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN 
        Companies ON Customers.company_id = Companies.company_id
        ORDER BY customer_id
        `): await connection.execute(`
        SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN 
        Companies ON Customers.company_id = Companies.company_id WHERE first_name LIKE ? OR last_name LIKE ?
        ORDER BY customer_id
        `, [`%${search}%`, `%${search}%`]);
        res.render('customers', {
            'customers': customers
        })
    })
    
    app.post('/customers', async function (req, res) {
        const { name } = req.body;
        res.redirect(`/customers?search=${encodeURIComponent(name)}`)
    })

    app.get('/create-customers', async function (req, res) {
        const [companies] = await connection.execute(`SELECT * FROM Companies`);
        const [employees] = await connection.execute(`SELECT * FROM Employees`);
        res.render('create-customers', {
            companies,
            employees
        });
    })

    app.post('/create-customers', async function (req, res) {
        const { first_name, last_name, rating, company_id } = req.body;
        const query = `INSERT INTO Customers (first_name, last_name, rating, company_id)
        VALUES ("${first_name}", "${last_name}", ${rating}, ${company_id});`

        const [response] = await connection.execute(query);

        const insertId = response.insertId;

        const { employees } = req.body;
        console.log(employees);
        let employeeArray = [];
        if (Array.isArray(employees)) {
            employeeArray = employees;
        } else {
            employeeArray.push(employees);
        }
        console.log(employeeArray);
        for (let employee_id of employeeArray) {
            console.log(employee_id,insertId)
            await connection.execute(`INSERT INTO EmployeeCustomer(employee_id,customer_id)
                                VALUES (?, ?)
            `, [employee_id, insertId])
        }
        res.redirect('/customers');
    })

    app.get("/delete-customers/:customerId", async function (req, res) {
        const { customerId } = req.params;
        const query = `SELECT * FROM Customers WHERE customer_id = ?`

        const [customers] = await connection.execute(query, [customerId]);
        const customerToDelete = customers[0];

        res.render('delete-customer', {
            'customer': customerToDelete
        })
    })

    app.post('/delete-customers/:customerId', async function (req, res) {
        const { customerId } = req.params;

        // check if the customerId is in a relationship with an employee
        const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ${customerId}`
        const [involved] = await connection.execute(checkCustomerQuery);
        if (involved.length > 0) {
            res.send("Unable to delete because the customer is in a sales relationship with an employee")
            return;
        }
        const query = `DELETE FROM Customers WHERE customer_id = ${customerId}`
        await connection.execute(query);
        res.redirect('/customers');
    })

    app.get('/update-customers/:customerId', async function (req, res) {
        const { customerId } = req.params;
        const query = `SELECT * FROM Customers WHERE customer_id = ${customerId}`
        const [customers] = await connection.execute(query);
        const wantedCustomer = customers[0];
        const [companies] = await connection.execute(`SELECT * FROM Companies`);

        res.render('update-customer', {
            'customer': wantedCustomer,
            'companies': companies
        })
    })

    app.post('/update-customers/:customerId', async function (req, res) {
        const { customerId } = req.params;
        const { first_name, last_name, rating, company_id } = req.body
        const query = `UPDATE Customers SET first_name="${first_name}", 
                        last_name="${last_name}", 
                        rating="${rating}", 
                        company_id="${company_id}"
                        WHERE customer_id = 1; `
        await connection.execute(query);
        res.redirect('/customers');
    })
}

main();

app.listen(3000, function () {
    console.log("Server has started");
})