USE employeetracker_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John","Jacob",3,2),
    ("Jane","Smith",2,3),
    ("Susie","Jones",1,null);

INSERT INTO department (item_name)
VALUES ('Sales'),
    ('IT'),
    ('Accounting'),
    ('HR');

INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 990000.00,1),
    ('Senior Manager',80000.00,3),
    ('Consultant',65000.00,3),
    ('Tech Consultant',70000.00,2);
