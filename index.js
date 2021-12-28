const res = require('express/lib/response');
const inquirer = require('inquirer');
const db = require('./db/connection');
const employeeArray = [];
const roleArray = [];

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
        type: 'list',
        name: 'selectEmployee',
        message: 'Select an Employee to change',
        when: (answers) => answers.choices === 'Update an Employee Role',
        choices: employeeArray,
    },
    {
        type: 'list',
        name: 'updateRole',
        message: 'Select the target role to change to:',
        when: (answers) => answers.choices === 'Update an Employee Role',
        choices: roleArray,
    }
];

async function loadEmployeeList() {
    const query = `SELECT id, concat(first_name, \' \', last_name) as employeeName FROM employee;`;
    const [rows] = await db.execute(query);
    const empNamesArray = rows.map((row) => row.employeeName);
    employeeArray.push(...empNamesArray);
}

async function loadRoleList() {
    const [rows] = await db.execute(`SELECT title FROM role;`);
    const roleTitlesArray = rows.map((row) => row.title);
    roleArray.push(...roleTitlesArray);
}

//Create a function to initialize app
async function init() 
{
    try {
    await loadEmployeeList();
    await loadRoleList();
    return inquirer.prompt(promptQuestions)
    .then(async (inputAnswer) => {
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
        else if (inputAnswer.choices === 'Add an Employee')
        {
            addEmployee(inputAnswer.newEmpFName, inputAnswer.newEmpLName, inputAnswer.newEmpTitle, inputAnswer.newEmpMgr);
        }
        else if (inputAnswer.choices === 'Update an Employee Role')
        {
            await updateRole(inputAnswer.selectEmployee, inputAnswer.updateRole);
        }
        db.end();
    });
}
catch (err){
    console.log(err);
}
}

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

async function getEmployeeId(getEmpName) {
    const getEmpIdSql =
      `SELECT * FROM employee WHERE CONCAT(first_name, ` +
      db.escape(" ") +
      `, last_name)=` +
      db.escape(getEmpName);
  
    const [rows] = await db.execute(getEmpIdSql);
    const empId = rows[0].id;
  
    return empId;
  }

async function getRoleId(getRoleName) {
    const getRoleIdSql =
        `SELECT * FROM role WHERE (title)=` +
        db.escape(getRoleName);

    const [rows] = await db.execute(getRoleIdSql);
    const roleId = rows[0].id;

    return roleId;
}

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
};

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
};

function addEmployee(newEmpFName, newEmpLName, newEmpTitle, newEmpMgr)
{
    const addRoleSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const addRoleParams = [newEmpFName, newEmpLName, newEmpTitle, newEmpMgr];
    db.query(addRoleSql, addRoleParams, (err, result) => 
    {
        if (err) {
        console.log(err.message);
        return;
        }
        console.log('Employee successfully added to database.');
    });
}

async function updateRole(empName, updateRoleName)
{
    try {
    var empId = await getEmployeeId(empName);
    var roleId = await getRoleId(updateRoleName);
    const addRoleSql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const addRoleParams = [roleId, empId];
    await db.execute(addRoleSql, addRoleParams);
        console.log('Employee title successfully updated in database.');
}
catch (err) {
    console.log("Update role error:", err);
}
}