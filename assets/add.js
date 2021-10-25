var inquirer = require("inquirer");
var mysql = require("mysql");
var app = require("../App");
var view = require("./view");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "root",
  database: "employeetracker_db",
});

exports.addEmployee = () => {
  view.getAllRoles(function (rolesResponse) {
    var roles = [];
    for (var i = 0; i < rolesResponse.length; i++) {
      roles.push(rolesResponse[i].title);
    }
    var options = [
      {
        type: "input",
        message: "Employee first name",
        name: "firstName",
        default: "John",
      },
      {
        type: "input",
        message: "Employee last name",
        name: "lastName",
        default: "Smith",
      },
      {
        type: "list",
        message: "Employee Role",
        name: "role",
        choices: roles,
      },
    ];

    inquirer.prompt(options).then((answers) => {
      var roleID = null;
      for (var i = 0; i < rolesResponse.length; i++) {
        if (rolesResponse[i].title === answers.role) {
          roleID = rolesResponse[i].role_id;
        }
      }
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          _id: roleID,
        },
        function (err, results) {
          if (err) throw err;
          console.log(
            "Sucessfully added " + answers.firstName + " " + answers.lastName
          );
          app.start();
        }
      );
    });
  });
};
