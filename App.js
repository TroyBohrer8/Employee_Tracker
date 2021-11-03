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

// db.connect(function (err) {
//   if (err) throw err;
// });

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

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, res) {
    // if (err) throw err;

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

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, res) {
    // if (err) throw err;
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
      // if (err) throw err;
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
  db.query("SELECT title FROM roles", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      allRoles.push(res[i].title);
    }
  });
  return allRoles;
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
  db.query("SELECT id, name FROM department", function (err, res) {
    // if (err) throw err;
    var departmentChoices = res.map(function (department) {
      return department.name;
    });

    const roleQuestions = [
      {
        name: "Title",
        type: "input",
        message: "Enter the role you'd like to add: ",
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the salary of this role?",
      },
      {
        name: "Department",
        type: "list",
        message: "Which department does this role belong to?",
        choices: departmentChoices,
      },
    ];

    if (res.length === 0) {
      console.error("Please enter a department!");
      return addRole();
    }

    inquirer.prompt(roleQuestions).then(function (roleAnswers) {
      var departmentId;
      for (var i = 0; i < res.length; i++) {
        if (roleAnswers.departmentChoices === res[i].name) {
          departmentId = res[i].id;
          break;
        }
      }

      db.query(
        "INSERT INTO role SET ?",
        {
          title: roleAnswers.Title,
          salary: roleAnswers.Salary,
          department_id: departmentId,
        },
        function (err, data) {
          if (err) throw err;

          console.info(`
          
          NEW ROLE HAS BEEN ADDED!
          
          ---MAIN MENU---
          `);
          homePage();
        }
      );
    });
  });
}

function updateEmployee() {
  db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id;', function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "updateId",
        message: "Select an employee to update: ",
        choices: function () {
          var allEmployees=[]
          for (var i=0; i<res.length; i++) {
            allEmployees.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`)
          }
          return allEmployees
        },
      },
     
      {
        name: "role",
        type: 'list',
        message: "Please select an updated role.",
        choices: selectRole()
      },
      {
        name: "manager",
        type: 'list',
        message: "Please select a manager",
        choices: selectManager()
      },
   
    ]).then(function (data) {
      console.log(data.manager)
      var managerId =selectRole().indexOf(data.manager)
      db.query('UPDATE employee SET WHERE ?',
        {
          id: data.updateId,
          role_id: data.roleId,
          manager_id: managerId
          
        }, function (err) {
          console.table(data)
          homePage()
        })
    })
  });
}

homePage();
