INSERT INTO department (dept_id, dept_name)
VALUES (1, "Plumber"),
    (2, "Carpenter"),
    (3, "Electrician"),
    (4, "Laborer"),
    (5, "Project Managment");
INSERT INTO role (role_id, title, salary, dept_id)
VALUES (01, "Plumber", 90000, 1),
    (02, "Carpenter", 60000, 2),
    (03, "Electrician", 100000, 3),
    (04, "Laborer", 40000, 4),
    (05, "Project Manager", 120000, 5);
INSERT INTO employee (emp_id, first_name, last_name, emp_role_id, manager_id)
VALUES (001, "John", "Smith", 01, NULL),
    (002, "Tony", "Cook", 02, NULL),
    (003, "DeSean", "Pratt", 03, NULL),
    (004, "Carlos", "Sanchez", 04, NULL),
    (005, "Brandon", "Mayhew", 05, 001);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;