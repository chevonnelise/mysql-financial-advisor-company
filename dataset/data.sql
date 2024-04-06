-- Sample INSERT Statements for Financial Advising Company Schema
use crm;
-- Inserting data into Companies
INSERT INTO Companies (name, description) VALUES
('Alpha Investments', 'A leading investment firm specializing in stocks and bonds'),
('Beta Financial Services', 'Offers a wide range of financial services including wealth management'),
('Gamma Capital', 'Focused on private equity and venture capital investments');

-- Inserting data into Customers
INSERT INTO Customers (first_name, last_name, rating, company_id) VALUES
('John', 'Doe', 5, 1),
('Jane', 'Smith', 4, 2),
('Alice', 'Johnson', 3, 3);

-- Inserting data into Departments
INSERT INTO Departments (name) VALUES
('Sales'),
('Marketing'),
('Finance');

-- Inserting data into Employees
INSERT INTO Employees (first_name, last_name, department_id) VALUES
('Robert', 'Brown', 1),
('Emily', 'Davis', 1),
('Michael', 'Wilson', 2);

-- Inserting data into Products
INSERT INTO Products (name, description) VALUES
('Investment Plan A', 'Comprehensive investment plan for long-term growth'),
('Retirement Fund B', 'Retirement fund with a focus on stability and steady income'),
('Equity Package C', 'Diverse equity package for aggressive growth');

-- Inserting data into Sales
INSERT INTO Sales (product_id, employee_id, customer_id, quantity, sale_date) VALUES
(1, 1, 1, 10, '2024-01-15'),
(2, 1, 2, 5, '2024-01-20'),
(3, 2, 3, 15, '2024-01-25');

-- Inserting data into EmployeeCustomer
INSERT INTO EmployeeCustomer (employee_id, customer_id) VALUES
(1, 1),
(2, 2),
(1, 3);

-- Inserting data into EmployeeProduct
INSERT INTO EmployeeProduct (employee_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3);