var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    session = require("cookie-session"),
    morgan = require("morgan")
    // loginMiddleware = require("./middleware/loginHelper");
    // routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  maxAge: 3600000,
  secret: 'secret',
  name: "reddit chip"
}));


// use loginMiddleware everywhere!
// app.use(loginMiddleware);

//******************* Home ****************************

app.get("/", function(req, res) {
  res.render("home")
})

//******************* Login ****************************



//******************* Logout ****************************



//******************* Teams ****************************



//******************* Players ****************************















app.listen(3000, function() {
  console.log("Server running on port 3000")
})
