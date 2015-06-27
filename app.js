require('dotenv').load();

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require("./models"),
    methodOverride = require("method-override"),
    session = require("cookie-session"),
    morgan = require("morgan"),
    passport = require("passport"),
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    TwitterStrategy = require("passport-twitter").Strategy,

    // loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");

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

app.use(passport.initialize())
app.use(passport.session())

//Authentication for Facebook Login
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("This is the access token:" , accessToken)
    console.log("This is the refreshToken:" , refreshToken)
    console.log("This is the profile:" , profile)
    db.User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err,user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("WE JUST SERIALIZED THE USER!")
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("WE JUST DESERIALIZED THE USER!")
  db.User.findById(id, function(err, user) {
    done(err, user);
  });
});

// AUTHENTICATION FOR A USER
  passport.use("local", new LocalStrategy.Strategy({
    usernameField: "local[username]",
    passwordField: "local[password]",
    passReqToCallback: true
  }, function(req, username, password, done) {
      db.User.findOne({
            "local.username": username
          },
          function (err, user) {
            console.log("ERRORS?", err)
            if (user === null){
              console.log("USER IS NULL")
              done(err,null);
            }
            else {
              user.checkPassword(password, done);
            }
          });
      })) 

//GOOGLE STRATEGY

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("This is the access token:" , accessToken);
    console.log("This is the refreshToken:" , refreshToken);
    console.log("This is the profile:" , profile);
    db.User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

//TWITTER STRATEGY

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log("This is the access token:" , token)
    console.log("This is the refreshToken:" , tokenSecret)
    console.log("This is the profile:" , profile)   
    db.User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));





// use loginMiddleware everywhere!
// app.use(loginMiddleware);

//******************* Home ****************************

app.get("/", function(req, res) {
  console.log("THIS IS REQ.USER", req.user)
  console.log("IS THIS USER ACTUALLY LOGGED IN???", req.isAuthenticated())
  res.render("home")
})

//******************* Sign Up ****************************

app.get("/signup", routeMiddleware.preventLoginSignup, function(req, res) {
  res.render("signUp")
})

//change form 
app.post("/signup", function(req, res) {
  db.User.create({local: req.body.local}, function(err, user) {
    
    if (err) console.log(err);
    console.log("CREATED!")
    passport.authenticate("local")(req, res, function(err,user) {
      // console.log("SOMETHING WENT WRONG?", err)
      // console.log("WE HAVE BEEN LOGGED IN!!");
      // console.log(req.isAuthenticated())
      // console.log(req.user)
      res.redirect("/teams")  
    })
    
  })
})

//******************* Login Twitter ****************************

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/teams');
  });


//******************* Login Google ****************************


app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/teams');
  });


//******************* Login Facebook ****************************


app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("WE SUCCESSFULLY AUTHENTICATED!")
    // Successful authentication, redirect home.
    res.redirect('/teams');
  });




//******************* Login ****************************

//TODO - add a separate login page to redirect to if they log in incorrectly

app.get("/login", routeMiddleware.preventLoginSignup, function(req, res) {
  res.render("login")
})

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/teams');
  });
  

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
      console.log(req.user)
      res.render("teams/index", {teams: teams, isLoggedIn: req.user})
    })
})

//New

app.get("/teams/new", function(req, res) {
  res.render("teams/new", {isLoggedIn: req.user._id});
})

//Show

app.get("/teams/:id", function(req, res) {
  db.Team.findById(req.params.id)
    .populate("players")
    .exec(function(err, team) {
      if(req.user === undefined) {
        req.user = {_id: "a"}
      } 
      console.log(req.user._id)
      console.log(typeof req.user._id)
      console.log(team.owner)
      console.log(typeof team.owner)

      res.render("teams/show", {team: team, isLoggedIn: req.user})
    })
})

//Create

app.post("/teams", function(req, res) {
  db.Team.create(req.body, function(err, team) {
    if(err) console.log(err);
    team.owner = req.user._id;
    team.save();
    db.User.findById(req.user._id, function(err, user) {
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

app.get("/teams/:id/edit", function(req, res) {
  db.Team.findById(req.params.id, function(err, team) {
    res.render("teams/edit", {team: team})
  })
})

//Update

app.put("/teams/:id", function(req, res) {
  db.Team.findByIdAndUpdate(req.params.id, req.body.team, function(err, team) {
    res.redirect("/teams/" + req.params.id)
  })
})

//Destroy

app.delete("/teams/:id", function(req, res) {
  
  db.Team.findByIdAndRemove(req.params.id, function(err, team) {
    if(err) console.log(err)
    res.redirect("/teams");
  })
})

//******************* Players ****************************

//Index

//New

app.get("/teams/:id/players/new", function(req, res) {
  db.Team.findById(req.params.id, function(err, team) {
    res.render("players/new", {team: team})    
  })

})

//Show

app.get("/players/:id", function(req, res) {
  db.Player.findById(req.params.id)
    .populate("team")
    .exec(function(err, player) {
      if(err) console.log(err);
      res.format({
        'text/html': function(){
          if(req.user === undefined) {
            req.user = {_id: ""}
          }
          res.render("players/show", {player: player, isLoggedIn: req.user._id})
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

//Create

app.post("/teams/:id/players", function(req, res) {
  console.log(req.body)
  db.Player.create(req.body, function(err, player) {
    if(err) console.log(err)
    player.owner = req.user._id;
    player.team = req.params.id;
    player.save();
    db.Team.findById(req.params.id, function(err, team) {
      if(err) console.log(err);
      team.players.push(player);
      team.save();
      db.User.findById(req.user._id, function(err, user) {
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

//Destroy

app.delete("/players/:id", function(req, res) {
  db.Player.findByIdAndRemove(req.params.id)
    .populate("team")
    .exec(function(err, player) {
      if(err) console.log(err);
      res.redirect("/teams/" + player.team._id)
    })
})













app.listen(3000, function() {
  console.log("Server running on port 3000")
})
