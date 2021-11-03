const fs = require("fs");
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const add = require("./assets/add");
const update = require("./assets/update");
const view = require("./assets/view");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "root",
  database: "employeetracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  exports.start();
});

exports.start = () => {
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
      if (res.choice === "View all employees") {
        view.viewAllEmployees();
      } else if (res.choice === "Add Employee") {
        add.addEmployee();
      } else if (res.choice === "Update Employee Role") {
        update.updateRole();
      } else if (res.choice === "Exit") {
        connection.end();
        return;
      }
    });
};
