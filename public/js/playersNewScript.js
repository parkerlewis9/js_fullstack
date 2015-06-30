$(document).ready(function() {
	var stats;
	var playerName = [];



	//Get data for all of the names to display in autocomplete list
	var urlTest = "https://probasketballapi.com/players?api_key=g1udvUO87qtohxB63HKLpVQkDZfS0ynX";
	$.post( urlTest , function( data ) {
	  var playerData = JSON.parse(data)
	  var splitArr = [];

	  playerData.forEach(function(datum) {
	  	splitArr = datum.player_name.split(" ");
	  	playerName.push(datum.player_name);
	  })
	  //event listeners for the two inputs
	  $("#player1first").keyup(dropDownFirst);
	  $("#player1last").keyup(dropDownLast);

	});


	function dropDownFirst() {
		var firstSearch = $("#player1first").val()
		var firstExp = new RegExp(firstSearch, "i");
		var firstOutput = '';
	//Build the li's if the input matches the regular expression
		playerName.forEach(function(name) {
			if(name.search(firstExp) !== -1) {
				firstOutput += "<li>";
				firstOutput += name;
				firstOutput += "</li>"
			}
			if(!firstSearch) {
				firstOutput = ""
			}
		}) 

		$(".searchresults").html(firstOutput)
		$(".autocomplete").show()
	}

	function dropDownLast() {
		var lastSearch = $("#player1last").val()
		var lastExp = new RegExp(lastSearch, "i");
		var lastOutput = '';
	//Build the li's if the input matches the regular expression
		playerName.forEach(function(name) {
			if(name.search(lastExp) !== -1) {
				lastOutput += "<li>";
				lastOutput += name;
				lastOutput += "</li>"
			}
			if(!lastSearch) {
				lastOutput = ""
			}
		}) 

		$(".searchresults").html(lastOutput)
		$(".autocomplete").show()
	}

	//Event listener for when the particular li is clicked
	$(".searchresults").on("click", "li", function(e) {
		$(".autocomplete").hide()
		$("#submitplayer").focus()
		//Get the name, split it and then put the parts into the the input fields
		var fullName = $(this).html();
		var nameSplit = fullName.split(" ");
		$("#player1first").val(nameSplit[0])
		$("#player1last").val(nameSplit[1])
	})





//TODO --- Make one function to search for results  √


//(API key is from probasketballapi.com and its under paike09 email address)
	function lookUpPlayerStats(firstName, lastName, callback) {
		$("#errorMsg").html("")
		var url = "https://probasketballapi.com/players?api_key=g1udvUO87qtohxB63HKLpVQkDZfS0ynX&first_name=" + firstName + "&last_name=" + lastName;
		//First request to get id:
		$.post( url , function( data ) {
		  var playerData = JSON.parse(data)
	//If we get something back:
		  if(playerData[0]) {
		  	var player_id = playerData[0].player_id;
		  	var newUrl = "https://probasketballapi.com/stats/players?api_key=g1udvUO87qtohxB63HKLpVQkDZfS0ynX&player_id=" + player_id;
			//Request to get data:
		  	$.post( newUrl , function( data ) {
		   		 var playerStats = JSON.parse(data);
					var points = 0;
					var blocks = 0;
					var steals = 0;
					var assists = 0;
					var rebounds = 0;
					playerStats.forEach(function(datum) {
						points += datum.box_pts;
						blocks += datum.box_blk;
						steals += datum.box_stl;
						assists += datum.box_ast;
						rebounds += (datum.box_oreb + datum.box_dreb)
					});
					var score = points + blocks + steals + assists + rebounds;
					//Object to send out
					stats = {};
					stats.points = points;
					stats.blocks = blocks;
					stats.steals = steals
					stats.assists = assists;
					stats.rebounds = rebounds;
					stats.score = score;
					return callback(stats)
		 	 });
	//If not: 	
		  } else {
		  	$("#player1-form").append('<p id="errorMsg">Please try again. Check your spelling. (If it is correct we may not have that player on file.)</p>');
		  }
		});
	}



//Event listener for one player look up
	$("#player1-form").on("submit", function(e) {
		e.preventDefault();
		$("#successfuladd").hide()
		// $(".searchresults").hide()
		var firstName = $("#player1first").val();
		var lastName = $("#player1last").val();
		lookUpPlayerStats(firstName, lastName, function(stats) {
			// var picUrl = 
			$.ajax({
					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + firstName + "+" + lastName + "+" + "espn",
					jsonp: "callback",
					dataType: "jsonp"
				}).done(function(data) {
				var imgUrl = data.responseData.results[0].unescapedUrl;

				//Add image to page
				$("#urlplayer1").attr("src", imgUrl)

				//Add stats to page
				$("#pointsplayer1").html(stats.points)

				$("#blocksplayer1").html(stats.blocks)

				$("#assistsplayer1").html(stats.assists)

				$("#reboundsplayer1").html(stats.rebounds)

				$("#stealsplayer1").html(stats.steals)

				$("#scoreplayer1").html(stats.score)

				//Add name to page
				$("#nameplayer1").html(firstName + " " + lastName)
				//Show the div slowly
				$("#hiddenstatsplayer1").fadeIn("slow", function() {
					//Remove values from textboxes
					$("#player1first").val("");
					$("#player1last").val("");
					//Refocus
					$("#player1first").focus();
				})
			})

		})
			
		

	})

//When actually adding a player to a team
	$("#addplayer1").on("submit", function(e) {
		e.preventDefault();
 		var name = $("#nameplayer1").html();
 		var arrName = name.split(" ");
 	//Look up their stats and imgUrl again
 		lookUpPlayerStats(arrName[0], arrName[1], function(stats) {
 			$.ajax({
 					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + arrName[0] + "+" + arrName[1] + "+" + "espn",
 					jsonp: "callback",
 					dataType: "jsonp"
 				}).done(function(data) {
 				// console.log(data.responseData.results[0].unescapedUrl);
 				var imgUrl = data.responseData.results[0].unescapedUrl;
 				var teamId = $("#teamid").attr("value")
 				var player = stats;
 				player.name = name;
 				player.imageUrl = imgUrl;
 				console.log(player)
 		//Actually create the player via a post
 				$.ajax({
 				  type: "POST",
 				  url: "/teams/" + teamId + "/players",
 				  data: player,
 				  
 				  dataType: "json"
 				}).done(function() {
 					$("#hiddenstatsplayer1").fadeOut("slow", function() {
 						$("#successfuladd").fadeIn("fast")
 						$("#player1first").focus()
 					})
 				})
 			})
 		})
	})

//When creating a team
	$("#newteamform").on("submit", function(e) {
		e.preventDefault();
	//Get name and url and put them in object to send out
		var teamName = $("#name").val();
		var teamUrl = $("#image").val();
		console.log(teamName)
		console.log(typeof teamUrl)
		if(teamName === "") {
			return $("#newteamform").append("<p>Please add a team name.</p>")
		}
		if(teamUrl === "") {
			return $("#newteamform").append("<p>Please add a team logo URL.</p>")
		}
		var teamData = {};
		teamData.name = teamName;
		teamData.imageUrl = teamUrl;
	//Create the team
		$.ajax({
		  type: "POST",
		  url: "/teams",
		  data: teamData,
		  dataType: "json"
		}).done(function(data) {
			$("#name").val("");
			$("#image").val("");
			$("#newteamform").fadeOut("slow", function() {
				$("#playersnew-one").fadeIn("slow", function() {
				//Add the teams info to the places that are required for making a player
					// $("#main-new").hide()
					$("#directions").html("Great! Now start adding players.");
					$("#addplayer1").attr("action", "/teams/"+ data.team._id + "/players");
					$("#teamid").attr("value", data.team._id);
					$("#successfuladd a").attr("href", "/teams/" + data.team._id);
					$("#gototeam a").attr("href", "/teams/" + data.team._id);
					$("#player1first").focus()
				});
			})
			
		})
	})


})











