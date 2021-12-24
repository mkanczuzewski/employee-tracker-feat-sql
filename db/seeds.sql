DELETE FROM department;
ALTER TABLE department AUTO_INCREMENT = 1;
INSERT INTO department (name)
VALUES
    ('Development'), 
    ('Marketing'),
    ('Professional Service'),
    ('Customer Support'),
    ('Technical Support');

DELETE FROM role;
ALTER TABLE role AUTO_INCREMENT = 1;
INSERT INTO role (title, salary, department_id)
VALUES
    ('Development Manager', 100000.00, 1),
    ('Developer', 75000.00, 1),
    ('Business Analyst', 60000.00, 1),
    ('QA Analyst', 50000.00, 1),
    ('Marketing Manager', 100000.00, 2),
    ('Marketing Representitive', 75000.00, 2),
    ('Sales Representitive', 75000.00, 2),
    ('Pro Serv Manager', 100000.00, 3),
    ('Implementer', 60000.00, 3),
    ('Trainer', 60000.00, 3),
    ('CS Manager', 100000.00, 4),
    ('CS Representitive', 50000.00, 4),
    ('TS Manager', 100000.00, 5),
    ('TS Representitive', 60000.00, 5),
    ('President', 60000.00, 5);

DELETE FROM employee;
ALTER TABLE employee AUTO_INCREMENT = 1;
SET foreign_key_checks = 0;
ALTER employee MODIFY manager_id INT NULL;
INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ('Jackson', 'Iglasias', 15);
    SELECT @ownerid := last_insert_id();
    UPDATE employee SET manager_id = @ownerid where role_id = 15;
    ALTER employee MODIFY manager_id INT NOT NULL;
    SET foreign_key_checks = 1;

SELECT @ownerid := last_insert_id();
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Mark', 'Smith', 1, @ownerid),
    ('Harald', 'Jenkins', 5, @ownerid),
    ('Andrea', 'Rollands', 8, @ownerid),
    ('Kathrine', 'Sanchez', 11, @ownerid),
    ('Lucinda', 'Perelli', 13, @ownerid);

SELECT @devmgrid := id from employee where role_id =1;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 2, @devmgrid),
    ('Jane', 'Wong', 3, @devmgrid),
    ('Tom', 'Wong', 4, @devmgrid);

SELECT @mrkmgrid := id from employee where role_id =5;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Alexander', 'Jones', 6, @mrkmgrid),
    ('Michael', 'Jones', 7, @mrkmgrid;

SELECT @psmgrid := id from employee where role_id =8;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES    
    ('Sarah', 'Perkins', 9, @psmgrid),
    ('Lama', 'Dennys', 10, @psmgrid);

SELECT @csmgrid := id from employee where role_id =11;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES       
    ('Diane', 'Mosa', 12, @csmgrid);

SELECT @tsmgrid := id from employee where role_id =13;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES    
    ('Ronald', 'Thomas', 14, @tsmgrid);
    