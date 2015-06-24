$(document).ready(function() {

	function lookUpPlayerStats(firstName, lastName, side, callback) {

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
		  	console.log("hello")
		  	$("#formleft-newplayer").append('<p id="errorMsg">Please try again. Check your spelling. (If it is correct we may not have that player on file.)</p>');
		  }
		});
	}




	//Left Column
	//Event listener for one player look up
		$("#formleft-newplayer").on("submit", function(e) {
			e.preventDefault();
			$("#successfuladdleft").hide()
			var firstName = $("#firstnameinputleft-newplayer").val();
			var lastName = $("#lastnameinputleft-newplayer").val();
			console.log(firstName)
			console.log(lastName)
			lookUpPlayerStats(firstName, lastName, "left", function(stats) {
				console.log("hello")
				$.ajax({
						url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + firstName + "+" + lastName + "+" + "espn",
						jsonp: "callback",
						dataType: "jsonp"
					}).done(function(data) {
					var imgUrl = data.responseData.results[0].unescapedUrl;

					//Add image to page
					$("#urlplayerleft").attr("src", imgUrl)

					//Add stats to page
					$("#pointsplayerleft").html(stats.points)

					$("#blocksplayerleft").html(stats.blocks)

					$("#assistsplayerleft").html(stats.assists)

					$("#reboundsplayerleft").html(stats.rebounds)

					$("#stealsplayerleft").html(stats.steals)

					$("#scoreplayerleft").html(stats.score)

					//Add name to page
					$("#nameplayerleft").html(firstName + " " + lastName)
					//Show the div slowly
					$("#hiddenstatsleft-newplayer").fadeIn("slow", function() {
						//Remove values from textboxes
						$("#firstnameinputleft-newplayer").val("");
						$("#lastnameinputleft-newplayer").val("");
						//Refocus
						$("#firstnameinputleft-newplayer").focus();
					})
				})

			})
				
			

		})

})




















