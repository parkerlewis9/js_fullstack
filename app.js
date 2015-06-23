var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    session = require("cookie-session"),
    morgan = require("morgan")
    loginMiddleware = require("./middleware/loginHelper");
    // routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  maxAge: 3600000,
  secret: 'secret',
  name: "league chip"
}));


// use loginMiddleware everywhere!
app.use(loginMiddleware);

//******************* Home ****************************

app.get("/", function(req, res) {
  res.render("home")
})

//******************* Sign Up ****************************

app.get("/signup", function(req, res) {
  res.render("signUp")
})

app.post("/signup", function(req, res) {
  db.User.create(req.body.user, function(err, user) {
    if (err) console.log(err);
    res.redirect("/teams")
  })
})

//******************* Login ****************************

//TODO - add a separate login page to redirect to if they log in incorrectly

app.post("/login", function(req, res) {
  var user = req.body.user;
  db.User.authenticate(user, function(err, user) {
    if(!err && user !== null) {
      req.login(user);
      res.redirect("/teams");
    } else {
      console.log(err);
      res.redirect("/")
    }
  })
})

//******************* Logout ****************************

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

//******************* Teams ****************************

//Index
app.get("/teams", function(req, res) {
  db.Team.find({})
    .populate("owner")
    .exec(function(err, teams) {
      res.render("teams/index", {teams: teams})
    })
})

//New

app.get("/teams/new", function(req, res) {
  res.render("teams/new");
})

//Show

//Create

app.post("/teams", function(req, res) {
  console.log(req.body)
  db.Team.create(req.body, function(err, team) {
    if(err) console.log(err);
    team.owner = req.session.id;
    team.save();
    db.User.findById(req.session.id, function(err, user) {
      user.teams.push(team);
      user.save();
      res.format({
        'text/html': function(){
          //this may be horribly wrong should check over
          res.redirect("/teams/" + team._id + "/players")
        },

        'application/json': function(){
          res.send({ team: team });
        },
        'default': function() {
          // log the request and respond with 406
          res.status(406).send('Not Acceptable');
        }
      });
      
    })
  })
})

//Edit

//Update

//Destroy

//******************* Players ****************************

//Index

//New

app.get("/teams/:id/players/new", function(req, res) {
  db.Team.findById(req.params.id, function(err, team) {
    res.render("players/new", {team: team})    
  })

})

//Show

//Create

app.post("/teams/:id/players", function(req, res) {
  console.log(req.body)
  db.Player.create(req.body, function(err, player) {
    if(err) console.log(err)
    player.owner = req.session.id;
    player.team = req.params.id;
    player.save();
    db.Team.findById(req.params.id, function(err, team) {
      if(err) console.log(err);
      team.players.push(player);
      team.save();
      db.User.findById(req.session.id, function(err, user) {
        if(err) console.log(err);
        user.players.push(player);
        user.save()
        res.format({
          'text/html': function(){
            //this may be horribly wrong should check over
            res.render("/teams/show", {team: team});
          },

          'application/json': function(){
            res.send({ player: player });
          },
          'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
          }
        });
      })
    })
  })
})

//Edit

//Update

//Delete













app.listen(3000, function() {
  console.log("Server running on port 3000")
})
