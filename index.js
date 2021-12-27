const inquirer = require('inquirer');
const db = require('./db/connection');


// const confirmRoleSalary = async (input) => 
// {
//     if (input !== decimal) 
//     {
//         return 'Incorrect Answer';
//     }
//     return true;
// };

const promptQuestions = 
[
    {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: 
        [
        "View all Departments", 
        "View all Roles", 
        "View all Employees", 
        "Add a Role", 
        "Add a Department", 
        "Add an Employee",
        "Update an Employee Role"
        ]
    },
    {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the employee\'s title?',
        when: (answers) => answers.choices === 'Add a Role',
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the employee\'s salary?',
        validate: (valSalary) => 
        {
            if (isNaN(valSalary)) 
            {
              return "Please backspace and enter a number";
            }
            return true;
        },
        when: (answers) => answers.choices === 'Add a Role',
    },
    {
        type: 'input',
        name: 'deptName',
        message: 'What is the employee\'s department?',
        when: (answers) => answers.choices === 'Add a Role',
    },
    {
        type: 'input',
        name: 'addDeptName',
        message: 'Add a new department:',
        when: (answers) => answers.choices === 'Add a Department',
    },
    {
        type: 'input',
        name: 'newEmpFName',
        message: 'Add new employee first name:',
        when: (answers) => answers.choices === 'Add an Employee',
    },
    {
        type: 'input',
        name: 'newEmpLName',
        message: 'Add new employee last name:',
        when: (answers) => answers.choices === 'Add an Employee',
    },
    {
        type: 'input',
        name: 'newEmpTitle',
        message: 'Add new employee title:',
        when: (answers) => answers.choices === 'Add an Employee',
    },
    {
        type: 'input',
        name: 'newEmpMgr',
        message: 'Add new employee Manager:',
        when: (answers) => answers.choices === 'Add an Employee',
    },
    {
        type: 'input',
        name: 'updateRole',
        message: 'Change Employee Role:',
        when: (answers) => answers.choices === 'Update an Employee Role',
    },
];



//Create a function to initialize app
function init() 
{
    return inquirer.prompt(promptQuestions)
    .then((inputAnswer) => {
        if (inputAnswer.choices === 'View all Departments')
        {
            getAllDepts();
        } 
        else if (inputAnswer.choices === 'View all Roles')
        { 
            getAllRoles();
        }
        else if (inputAnswer.choices === 'View all Employees')
        { 
            getAllEmp();
        }
        else if (inputAnswer.choices === 'Add a Role')
        {
            addRole(inputAnswer.roleTitle, inputAnswer.roleSalary, inputAnswer.deptName);
        }
        else if (inputAnswer.choices === 'Add a Department')
        {
            addDept(inputAnswer.addDeptName);
        }
    });
};

// Function call to initialize app
init()

// Functions to get all the results from a single table
function getAllDepts() {
    db.query(`SELECT * FROM department`, function (err, results) {
        console.table(results);
    });
};

function getAllRoles() {
    db.query(`SELECT * FROM role`, function (err, results) {
        console.table(results);
    });
};

function getAllEmp() {
    db.query(`SELECT * FROM employee`, function (err, results) {
        console.table(results);
    });
};

function addRole(roleTitle, roleSalary, deptName)
{
    const addRoleSql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
    const addRoleParams = [roleTitle, roleSalary, deptName];
    db.query(addRoleSql, addRoleParams, (err, result) => 
    {
        if (err) {
        console.log(err.message);
        return;
        }
        console.log('Role successfully added to database.');
    });
}

function addDept(addDeptName)
{
    const addRoleSql = `INSERT INTO department (name) VALUES (?)`;
    const addRoleParams = [addDeptName];
    db.query(addRoleSql, addRoleParams, (err, result) => 
    {
        if (err) {
        console.log(err.message);
        return;
        }
        console.log('Department successfully added to database.');
    });
}