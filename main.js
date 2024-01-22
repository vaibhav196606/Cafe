const express = require("express");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/dbConnectionConfig");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
dbConnection();
const PORT = process.env.PORT;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));
  app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/", require("./routes/route"));




app.set("view engine","ejs");

app.listen(PORT, ()=>{
    console.log("App is live on Port " + PORT);
})