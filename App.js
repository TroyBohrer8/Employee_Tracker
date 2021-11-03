const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "root",
  database: "employeetracker_db",
});

db.connect(function (err) {
  if (err) throw err;
});

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all employees by department",
          "View all employees by manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.choice) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Exit":
          exit();
      }
    });
}

function exit() {
  console.log("You have exited the Employee Tracker app")
  process.exit();
}

function viewDepartments() {

}

function viewRoles() {

}

function viewEmployees() {

}

function updateEmployee() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {
  
}



startApp();
