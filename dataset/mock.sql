INSERT INTO Customers(first_name, last_name, rating, company_id)
    VALUES ("Chu Kang", "Phua", 4, 1)


UPDATE Customers SET first_name="Gandalf", 
    last_name="Greyhame", rating=5, company_id=1
WHERE customer_id = 1;