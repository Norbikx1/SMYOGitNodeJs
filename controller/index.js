//Imports the libraries
var express = require('express'),
    mustache = require('mustache-express'),
    path = require('path')
var app = express();
app.set('port', process.env.PORT || 3000);

//Imports the body parser library
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
})); 

//imports the bcrypt library
var bcrypt = require('bcrypt');

//Creates instance for the product table in the database
var DAO = require('../model/nedb');
//Creates a file for the information
var dbFile = 'database.nedb.db';
//Runs the table in embedded mode
let dao = new DAO(dbFile);
//Initializes product table, only used during testing.
//dao.init();
//dao.deleteAllEntries();
//dao.all().then((products) => console.log(products));

//Creates instance for the user table in the database
var userTable = require('../model/userdb');
//Creates a file for the information
var dbUserFile = 'userTable.nedb.db';
//Runs the table in embedded mode
let userTab = new userTable(dbUserFile);
//Initializes product table, only used during testing.
//userTab.init();
//userTab.deleteAllEntries();
//userTab.all().then((userAccounts) => console.log(userAccounts));


//Handles mustache
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, '../view'));

//Main page handler. Passes the list of all database entries to the mustache as "entries"
app.get('/', function(req,res){
    dao.all()
    .then((list)=>{
        res.render("index",{'entries': list});
        console.log(list)
    })
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the entries from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
})

//New Entry page handler
app.get('/newEntry', function(req,res){
    res.render("newEntry");
});

//Handles the post action. Checks if all fields are filled and adds a new object to the database, then redirects to the index page. Or informs the user that fields need to be filled.
app.post('/newEntry', function(req,res){
    if (!req.body.brand|| !req.body.type|| !req.body.colour){
        res.status(400).send("Entries must have a Item Brand , type and a colour!");
        return;
    }

    dao.add(req.body.brand, req.body.type, req.body.colour);
    console.log("A new entry has been added to the product table");
    res.redirect('/');
});

//Home page handler
app.get('/home', function(req, res){
    res.render("home");
});

//Login page handler
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res){

    userTab.find(req.body.email)
    .then((user) => {
        console.log(user);
        bcrypt.compare(req.body.password, user.passwordField, function(){
            res.redirect('/home');
        });
    
    })
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the user account information from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
});

app.get('/logout', function(req, res){
    res.redirect('login');
});

//Register page handler
app.get('/register', function(req, res){
    res.render('register');
});

//Allows the user to create an account with hashed password meaning that the password is not saved as plain string
app.post('/register', function(req, res){
    if(!req.body.name || !req.body.email || !req.body.password){
        res.status(400).send("You must fill all the fields");
        return;
    }
    
    var hashedPassword = bcrypt.hashSync(req.body.password, 15);
    userTab.add(req.body.name, req.body.email, hashedPassword);
    console.log("A new entry has been added to the user table");
    res.redirect('/login');
});

//404 response
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//500 response
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

//Confirmation of the website starting
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

