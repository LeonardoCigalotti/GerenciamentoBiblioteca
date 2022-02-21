const express = require("express");
const session = require("express-session");
const app = express();
const conn = require("./database/database");
const bodyParser = require("body-parser");

const moment = require("moment");
const format = moment().format("DD/MM/YYYY HH:mm");
app.locals.moment = moment;
app.locals.format = format;

const booksController = require("./books/BooksController");
const usersController = require("./users/UsersController");
const reservController = require("./reserv/ReservController");

const Books = require("./books/Books");
const User = require("./users/User");
const Reserv = require("./reserv/Reserv");

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Sessions
app.use(session({
  secret: "qualquercoisa", cookie: { maxAge: 30000000 }
}))

//Static Files
app.use(express.static('public'));

//view-engine
app.set('view engine', 'ejs');

//connection with database
conn
  .authenticate().then(() => {
    console.log("Database connected!");
  }).catch((error) => {
    console.log(error);
  });

//Set controllers
app.use("/", booksController);
app.use("/", usersController);
app.use("/", reservController);

//routes
app.get("/", (req, res) =>{
  Books.findAll({raw: true, order: [
    ['title', 'ASC']]}).then(books => {
    res.render("index", {books : books });
  });
});

app.get("/login", (req, res) =>{
  res.render("login")
});


//Server connect
app.listen(8000, () =>{
    console.log("Server funcionando na porta 8000!");
});