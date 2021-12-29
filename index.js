const inquirer = require('inquirer');
const db = require('./db/connection');
const employeeArray = [];
const roleArray = [];
const deptArray = [];
const managerArray = [];

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
        type: 'list',
        name: 'deptName',
        message: 'What is the employee\'s department?',
        when: (answers) => answers.choices === 'Add a Role',
        choices: deptArray,
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
        type: 'list',
        name: 'newEmpTitle',
        message: 'Add new employee title:',
        when: (answers) => answers.choices === 'Add an Employee',
        choices: roleArray,
    },
    {
        type: 'list',
        name: 'newEmpMgr',
        message: 'Add new employee Manager:',
        when: (answers) => answers.choices === 'Add an Employee',
        choices: managerArray,
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

async function loadEmployeeList() 
{
    const query = `SELECT id, concat(first_name, \' \', last_name) as employeeName FROM employee;`;
    const [rows] = await db.execute(query);
    const empNamesArray = rows.map((row) => row.employeeName);
    employeeArray.push(...empNamesArray);
}

async function loadRoleList() 
{
    const [rows] = await db.execute(`SELECT title FROM role;`);
    const roleTitlesArray = rows.map((row) => row.title);
    roleArray.push(...roleTitlesArray);
}

async function loadDepartmentList() 
{
    const [rows] = await db.execute(`SELECT name FROM department;`);
    const deptNameArray = rows.map((row) => row.name);
    deptArray.push(...deptNameArray);
}

async function loadManagerList() 
{
    const query = `select concat(e.first_name, \' \', e.last_name) as employeeName from employee as e inner join role as r on e.role_id = r.id where r.title like '%manager'`;
    const [rows] = await db.execute(query);
    const empNamesArray = rows.map((row) => row.employeeName);
    managerArray.push(...empNamesArray);
}

//Create a function to initialize app
async function init() 
{
    try 
    {
        await loadEmployeeList();
        await loadRoleList();
        await loadDepartmentList();
        await loadManagerList();
        return inquirer.prompt(promptQuestions)
        .then(async (inputAnswer) => 
        {
            if (inputAnswer.choices === 'View all Departments')
            {
                await getAllDepts();
            } 
            else if (inputAnswer.choices === 'View all Roles')
            { 
                await getAllRoles();
            }
            else if (inputAnswer.choices === 'View all Employees')
            { 
                await getAllEmp();
            }
            else if (inputAnswer.choices === 'Add a Role')
            {
                await addRole(inputAnswer.roleTitle, inputAnswer.roleSalary, inputAnswer.deptName);
            }
            else if (inputAnswer.choices === 'Add a Department')
            {
                await addDept(inputAnswer.addDeptName);
            }
            else if (inputAnswer.choices === 'Add an Employee')
            {
                await addEmployee(inputAnswer.newEmpFName, inputAnswer.newEmpLName, inputAnswer.newEmpTitle, inputAnswer.newEmpMgr);
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
    };
};

// Function call to initialize app
init()

// Functions to get all the results from a single table
async function getAllDepts() 
{
    try 
    {
        const [results] = await db.execute(`SELECT * FROM department`);
        console.table(results);
    }
    catch(err) {
        console.log(err);    
    };
};

async function getAllRoles() {
    try 
    {
        const [results] = await db.execute(`SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id=department.id;`);
        console.table(results);
    }
    catch(err) {
        console.log(err);
    };
};

async function getAllEmp() 
{
    try 
    {
        const [results] = await db.execute(`SELECT * FROM employee`);
        console.table(results);
    }
    catch(err) {
        console.log(err);
    };
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

async function getDeptId(getDeptName) {
    const getDeptIdSql = 
    `SELECT * FROM department WHERE (name)=` +
    db.escape(getDeptName);

    const [rows] = await db.execute(getDeptIdSql);
    const deptId = rows[0].id;

    return deptId;
}

async function addRole(roleTitle, roleSalary, deptName)
{
    try 
    {
        let deptId = await getDeptId(deptName)
        const addRoleSql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        const addRoleParams = [roleTitle, roleSalary, deptId];
        await db.execute(addRoleSql, addRoleParams); 
        console.log('Role successfully added to database.');    
    }
    catch (err)
    {
        console.log(err.message); 
    };
};

async function addDept(addDeptName)
{
    try
    {
        const addRoleSql = `INSERT INTO department (name) VALUES (?)`;
        const addRoleParams = [addDeptName];
        await db.execute(addRoleSql, addRoleParams);
        console.log('Department successfully added to database.');
    }
    catch (err)
    {
        console.log(err.message);
    };
};

async function addEmployee(newEmpFName, newEmpLName, newEmpTitle, newEmpMgr)
{
    try
    {
        let roleId = await getRoleId(newEmpTitle);
        let mgrId = await getEmployeeId(newEmpMgr);
        const addRoleSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const addRoleParams = [newEmpFName, newEmpLName, roleId, mgrId];
        await db.execute(addRoleSql, addRoleParams);
        console.log('Employee successfully added to database.');
    }
    catch (err)
    {
        console.log(err.message);
    };
};

async function updateRole(empName, updateRoleName)
{
    try 
    {
        let empId = await getEmployeeId(empName);
        let roleId = await getRoleId(updateRoleName);
        const addRoleSql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const addRoleParams = [roleId, empId];
        await db.execute(addRoleSql, addRoleParams);
            console.log('Employee title successfully updated in database.');
    }
    catch (err) 
    {
        console.log("Update role error:", err);
    };
};