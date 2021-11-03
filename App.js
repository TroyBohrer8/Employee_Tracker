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

function homePage() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all departments",
          "View all employees by role",
          "Add Employee",
          "Add Department",
          "Add Employee Role",
          "Update Employee Role",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.choice) {
        case "View all employees":
          viewEmployees();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case "View all employees by role":
          viewRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Employee Role":
          addRole();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Exit":
          exit();
      }
    });
}

function exit() {
  console.log("You have exited the Employee Tracker app");
  process.exit();
}

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(`
  
  --------DEPARTMENTS---------------
  `);
    console.table(res);
    console.log(`
  -------END DEPARTMENTS---------
  
  ---MAIN MENU---
  `);
    homePage();
  });
}

function viewRoles() {
  db.query(
    "SELECT department.name AS Department, role.title AS Role, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log(`
  
  ------------ROLES---------------
  `);
      console.table(res);
      console.log(`
  ----------END ROLES-------------
  
  ---MAIN MENU---
  `);
      homePage();
    }
  );
}

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    console.log(`
  
    --------EMPLOYEES---------------
  `);
    console.table(res);
    console.log(`
  ----------END EMPLOYEES-------------
  
  ---MAIN MENU---
  `);
    homePage();
  });
}

function updateEmployee() {
  console.log("update");
}

function addDepartment() {
  {
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "Enter the new department name: ",
        },
      ])
      .then(function (data) {
        db.query(
          "INSERT INTO department SET ?",
          {
            name: data.department,
          },
          function (err) {
            console.log(`
  YOUR NEW DEPARTMENT AS BEEN ADDED!
  
  ---MAIN MENU---
  `);
            console.table(data);
            homePage();
          }
        );
      });
  }
}

function addRole() {
  console.log("add.r");
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "New employee first name: ",
      },
      {
        name: "last_name",
        type: "input",
        message: "New employee last name: ",
      },
      {
        name: "role",
        type: "list",
        message: "What is the new employees role?",
        choices: selectRole(),
      },
      {
        name: "manager",
        type: "list",
        message: "Please select a manager.",
        choices: selectManager(),
      },
    ])

    .then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1;
      var managerId = selectManager().indexOf(data.manager) + 1;

      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: data.first_name,
          last_name: data.last_name,
          manager_id: managerId,
          role_id: roleId,
        },
        function (err, res) {
          if (err) throw err;

          homePage();
        }
      );
    });
}

function selectRole() {
  db.query("SELECT title FROM role", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      showRoles.push(res[i].title);
    }
  });
  return showRoles;
}

function selectManager() {
  db.query(
    "SELECT * FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        showManagers.push(
          `${res[i].id} - ${res[i].first_name} ${res[i].last_name}`
        );
      }
    }
  );
  return showManagers;
}

homePage();
