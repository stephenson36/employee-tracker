create database employeetracker_db;

use employeetracker_db;

create table department (
    id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

create table role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NULL,
    department_id INT default 0,
    PRIMARY KEY (id)
);

create table employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT default 0,
    manager_id INT NULL,
    PRIMARY KEY (id)
);