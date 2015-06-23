$(document).ready(function() {
var stats;

//TODO --- Make one function to search for results  √

	function lookUpPlayerStats(firstName, lastName, callback) {
		console.log(firstName + " " + lastName)
		$("#errorMsg").html("")
		var url = "https://probasketballapi.com/players?api_key=SoBO1Is4dA2cpkR0J9mlMgbftZv5wzNu&first_name=" + firstName + "&last_name=" + lastName;
		//First request to get id:
		$.post( url , function( data ) {
		  var playerData = JSON.parse(data)
	//If we get something back:
		  if(playerData[0]) {
		  	var player_id = playerData[0].player_id;
		  	var newUrl = "https://probasketballapi.com/stats/players?api_key=SoBO1Is4dA2cpkR0J9mlMgbftZv5wzNu&player_id=" + player_id;
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
		var teamData = {};
		teamData.name = teamName;
		teamData.imageUrl = teamUrl;
	//Create the player
		$.ajax({
		  type: "POST",
		  url: "/teams",
		  data: teamData,
		  dataType: "json"
		}).done(function(data) {
			$("#name").val("");
			$("#image").val("");
			$("#main-new").fadeOut("slow", function() {
				$("#playersnew-one").fadeIn("slow", function() {
				//Add the teams info to the places that are required for making a player
					$("#directions").html("Great! Now start adding players.");
					$("#addplayer1").attr("action", "/teams/"+ data.team._id + "/players");
					$("#teamid").attr("value", data.team._id);
					$("#successfuladd a").attr("href", "/teams/" + data.team._id);
					$("#gototeam a").attr("href", "/teams/" + data.team._id);
				});
			})
			
		})
	})


})











