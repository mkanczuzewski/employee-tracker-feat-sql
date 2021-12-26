const inquirer = require('inquirer');

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
    return inquirer.prompt(promptQuestions);
};

// Function call to initialize app
init()
