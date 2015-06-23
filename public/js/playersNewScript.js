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
		var firstName = $("#player1first").val();
		var lastName = $("#player1last").val();
		lookUpPlayerStats(firstName, lastName, function(stats) {
			// var picUrl = 
			$.ajax({
					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + firstName + "+" + lastName + "+" + "espn",
					jsonp: "callback",
					dataType: "jsonp"
				}).done(function(data) {
				console.log(data.responseData.results[0].unescapedUrl);
				var imgUrl = data.responseData.results[0].unescapedUrl;
				//Add image to page
				$("#urlplayer1").attr("src", imgUrl)
				$("#player1image").attr("value", imgUrl)

				//Add stats to page
				$("#pointsplayer1").html(stats.points)
				$("#player1points").attr("value", stats.points)

				$("#blocksplayer1").html(stats.blocks)
				$("#player1blocks").attr("value", stats.blocks)

				$("#assistsplayer1").html(stats.assists)
				$("#player1assists").attr("value", stats.assists)

				$("#reboundsplayer1").html(stats.rebounds)
				$("#player1rebounds").attr("value", stats.rebounds);

				$("#stealsplayer1").html(stats.steals)
				$("#player1steals").attr("value", stats.steals)

				$("#scoreplayer1").html(stats.score)
				$("#player1score").attr("value", stats.score)

				$("#player1name").attr("value", firstName + " " + lastName)

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


	$("#addplayer1").on("submit", function(e) {
		e.preventDefault();
 		var name = $("#nameplayer1").html();
 		var arrName = name.split(" ");
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
 				player.imgUrl = imgUrl;
 				console.log(player)

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


})











