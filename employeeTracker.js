const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

let roleChoices = [];
let employeeChoices = [];
let departmentChoices = [];

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'mojo44',
    database: 'employeetracker_db',

});

const getRoles = () => {
    roleChoices = [];
       let query = 'SELECT * FROM role ';
        connection.query(query, (err,res) => {
            if(err) throw err;
            res.forEach(({title}) => {
                roleChoices.push(title);
            });
            return roleChoices;
        });  
};

const getEmployee = () => {
    employeeChoices = [];
       let query = 'SELECT * FROM employee ';
        connection.query(query, (err,res) => {
            if(err) throw err;
            res.forEach(({first_name, last_name}) => {
                employeeChoices.push(`${first_name} ${last_name}`);
            });
            return employeeChoices;
        });  
};

const getDepartments = () => {
    departmentChoices = [];
       let query = 'SELECT * FROM department ';
        connection.query(query, (err,res) => {
            if(err) throw err;
            res.forEach(({item_name}) => {
                departmentChoices.push(item_name);
            });
            return departmentChoices;
        });  
};

// add departments, roles, employees
const addEmployees = async () => {
    let roleChoice = await getRoles();
    let employeeChoice = await getEmployee();
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: roleChoices,
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: employeeChoices,
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                },
                (err,res) => {
                    if(err) throw err;
                }
            );
            let query =
                'UPDATE employee ';
              query +=
                'SET employee.role_id = ( ';
              query +=
                'SELECT role.id ';
              query +=
                'FROM role ';
              query +=
                'WHERE role.title = ? ) ';
              query +=
                'WHERE employee.first_name = ? AND employee.last_name = ?';
            connection.query(query, [answer.role, answer.firstName, answer.lastName],(err,res) => {
                if(err) throw err;
            });
            runApp();
        });
};

const addDepartments = async () => {
    inquirer
        .prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: "What is the department name?",
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    item_name: answer.departmentName,
                },
                (err,res) => {
                    if(err) throw err;
                }
            );
            runApp();
        });
};

const addRoles = async () => {
    let departmentChoice = await getDepartments();
    inquirer
        .prompt([
            {
                name: 'roleName',
                type: 'input',
                message: "What is the role name?",
            },
            {
                name: 'roleSalary',
                type: 'input',
                message: "What is the salary for this role?",
            },
            {
                name: 'roleDepartment',
                type: 'list',
                message: "Which department houses this role?",
                choices: departmentChoices,
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.roleName,
                    salary: answer.roleSalary,
                },
                (err,res) => {
                    if(err) throw err;
                }
            );
            let query =
                'UPDATE role ';
              query +=
                'SET role.department_id = ( ';
              query +=
                'SELECT department.id ';
              query +=
                'FROM department ';
              query +=
                'WHERE department.item_name = ? ) ';
              query +=
                'WHERE role.title = ?';
            connection.query(query, [answer.roleDepartment, answer.roleName],(err,res) => {
                if(err) throw err;
            });
            runApp();
        });
};

// view departments, roles, employees
const viewEmployees = () => {
    let values = []; 
    let query =
        'SELECT * FROM role ';
      query +=
        'INNER JOIN employee ON (role.id = employee.role_id) ';
      query +=
        'INNER JOIN department ON (role.department_id = department.id) ';
       query +=
         'ORDER BY employee.first_name';
    connection.query(query, (err,res) => {
        res.forEach(({id,first_name,last_name,title,salary,item_name}) => {
            values.push(
                {
                    ID: id,
                    First_Name: first_name,
                    Last_Name: last_name,
                    Title: title,
                    Department: item_name,
                    Salary: salary,
                }
            );
        });
        console.table(values);
        runApp();
    });
};

const viewDepartments = () => {
    let values = [];
    let query =
        'SELECT * FROM role ';
      query +=
        'INNER JOIN employee ON (role.id = employee.role_id) ';
      query +=
        'INNER JOIN department ON (role.department_id = department.id)';
      query +=
        'ORDER BY department.item_name';
    connection.query(query, (err,res) => {
        res.forEach(({first_name,last_name,title,salary,item_name}) => {
            values.push(
                {
                    First_Name: first_name,
                    Last_Name: last_name,
                    Title: title,
                    Department: item_name,
                    Salary: salary
                }
            );
        });
        console.table(values);
        runApp();
    });
};

const viewRoles = () => {
    let values = [];
    let query =
        'SELECT * FROM role ';
      query +=
        'INNER JOIN employee ON (role.id = employee.role_id) ';
      query +=
        'INNER JOIN department ON (role.department_id = department.id)';
      query +=
        'ORDER BY role.title';
    connection.query(query, (err,res) => {
        res.forEach(({first_name,last_name,title,salary,item_name}) => {
            values.push(
                {
                    First_Name: first_name,
                    Last_Name: last_name,
                    Title: title,
                    Department: item_name,
                    Salary: salary
                }
            );
        });
        console.table(values);
        runApp();
    });
};

// update employee roles
const updateRoles = async () => {
    let roleChoice = await getRoles();
    let employeeChoice = await getEmployee();
    inquirer
        .prompt([
            {
                name: 'test',
                type: 'list',
                message: 'This is a test',
                choices: ['okay'],
            },
            {
                name: 'change',
                type: 'list',
                message: "Which employee would you like to change the role for?",
                choices: employeeChoices,
            },
            {
                name: 'newRole',
                type: 'list',
                message: 'Please choose a role',
                choices: roleChoices,
            }

        ])
        .then((answer) =>{
            let query =
                'UPDATE employee ';
              query +=
                'SET employee.role_id = ( ';
              query +=
                'SELECT role.id ';
              query +=
                'FROM role ';
              query +=
                'WHERE role.title = ? ) ';
              query +=
                'WHERE CONCAT(employee.first_name," ",employee.last_name) = ?';
            connection.query(query, [answer.newRole, answer.change],(err,res) => {
                if(err) throw err;
            });
            runApp();
        });
}

// run application
const runApp =() => {
    inquirer
        .prompt(
            {
                name: 'action',
                type: 'rawlist',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Departments',
                    'View All Roles',
                    'Add Employee',
                    'Add Department',
                    'Add Role',
                    'Update Employee Role',               
                ],
        })
        .then((answer) => {
            switch(answer.action) {
                case 'View All Employees':
                    viewEmployees();
                break;
                case 'View All Departments':
                    viewDepartments();
                break;
                case 'View All Roles':
                    viewRoles();
                break;
                case 'Add Employee':
                    addEmployees();
                break;
                case 'Add Department':
                    addDepartments();
                break;
                case 'Add Role':
                    addRoles();
                break;
                case 'Update Employee Role':
                    updateRoles();
                break;
            }
        })

}

connection.connect((err) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`)
    runApp();
    // connection.end();
})