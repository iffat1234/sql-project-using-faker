const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const { count } = require('console');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'iffatnigar18@',
});


//faker part
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),

    ];
};


//route
app.get("/", (req, res) => {
    let q = `select count(*) from user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }

});
//show route
app.get("/users", (req, res) => {
    let q = `select * from user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showusers.ejs", { users });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});

//edit route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;//for finding id
    let q = `select * from user where id = '${id}' `;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});

//update rote
app.put("/user/:id", (req, res) => {
    let { id } = req.params;//for finding id
    let { password: formpass, username: newusername } = req.body;
    let q = `select * from user where id = '${id}' `;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formpass != user.password) {
                res.send("wrong password");
            } else {
                let q2 = `update user set username = '${newusername}' where id='${id}'`
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                });
            }
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }

});
app.listen("8080", () => {
    console.log("server is listening to port 8080");
})