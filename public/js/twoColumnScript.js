$(document).ready(function() {

	function lookUpPlayerStats(firstName, lastName, side, callback) {

		$(".errorMsg").html("")
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
		  	$("#form" + side + "-newplayer").append('<p class="errorMsg">Please try again. Check your spelling. (If it is correct we may not have that player on file.)</p>');
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
			lookUpPlayerStats(firstName, lastName, "left", function(stats) {
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

				//function to compare stats
						compareAndHighlight()



						//Remove values from textboxes
						$("#firstnameinputleft-newplayer").val("");
						$("#lastnameinputleft-newplayer").val("");
						//Refocus
						$("#firstnameinputleft-newplayer").focus();
					})
				})

			})
				
			

		})


//When actually adding a player to a team
	$("#addplayerleft").on("submit", function(e) {
		e.preventDefault();
 		var name = $("#nameplayerleft").html();
 		var arrName = name.split(" ");
 	//Look up their stats and imgUrl again
 		lookUpPlayerStats(arrName[0], arrName[1], "left", function(stats) {
 			$.ajax({
 					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + arrName[0] + "+" + arrName[1] + "+" + "espn",
 					jsonp: "callback",
 					dataType: "jsonp"
 				}).done(function(data) {
 				var imgUrl = data.responseData.results[0].unescapedUrl;
 				var teamId = $("#teamid").attr("value")
 				var player = stats;
 				player.name = name;
 				player.imageUrl = imgUrl;
 		//Actually create the player via a post
 				$.ajax({
 				  type: "POST",
 				  url: "/teams/" + teamId + "/players",
 				  data: player,
 				  
 				  dataType: "json"
 				}).done(function() {
 					$("#hiddenstatsleft-newplayer").fadeOut("slow", function() {

 						clearWhenHidden()

 						$("#successfuladdleft").fadeIn("slow") 	
 					})
 				})
 			})
 		})
	})








//Right Column
//Event listener for one player look up
	$("#formright-newplayer").on("submit", function(e) {
		e.preventDefault();
		$("#successfuladdright").hide()
		var firstName = $("#firstnameinputright-newplayer").val();
		var lastName = $("#lastnameinputright-newplayer").val();
		lookUpPlayerStats(firstName, lastName, "right", function(stats) {

			$.ajax({
					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + firstName + "+" + lastName + "+" + "espn",
					jsonp: "callback",
					dataType: "jsonp"
				}).done(function(data) {
				var imgUrl = data.responseData.results[0].unescapedUrl;

				//Add image to page
				$("#urlplayerright").attr("src", imgUrl)

				//Add stats to page
				$("#pointsplayerright").html(stats.points)

				$("#blocksplayerright").html(stats.blocks)

				$("#assistsplayerright").html(stats.assists)

				$("#reboundsplayerright").html(stats.rebounds)

				$("#stealsplayerright").html(stats.steals)

				$("#scoreplayerright").html(stats.score)

				//Add name to page
				$("#nameplayerright").html(firstName + " " + lastName)
				//Show the div slowly
				$("#hiddenstatsright-newplayer").fadeIn("slow", function() {


//function to compare stats
					compareAndHighlight()





					//Remove values from textboxes
					$("#firstnameinputright-newplayer").val("");
					$("#lastnameinputright-newplayer").val("");
					//Refocus
					$("#firstnameinputright-newplayer").focus();
				})
			})

		})
			
		

	})



//When actually adding a player to a team
	$("#addplayerright").on("submit", function(e) {
		e.preventDefault();
 		var name = $("#nameplayerright").html();
 		var arrName = name.split(" ");
 	//Look up their stats and imgUrl again
 		lookUpPlayerStats(arrName[0], arrName[1], "right", function(stats) {
 			$.ajax({
 					url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + arrName[0] + "+" + arrName[1] + "+" + "espn",
 					jsonp: "callback",
 					dataType: "jsonp"
 				}).done(function(data) {
 				var imgUrl = data.responseData.results[0].unescapedUrl;
 				var teamId = $("#teamid").attr("value")
 				var player = stats;
 				player.name = name;
 				player.imageUrl = imgUrl;
 		//Actually create the player via a post
 				$.ajax({
 				  type: "POST",
 				  url: "/teams/" + teamId + "/players",
 				  data: player,
 				  
 				  dataType: "json"
 				}).done(function() {
 					$("#hiddenstatsright-newplayer").fadeOut("slow", function() {

 						clearWhenHidden()

 						$("#successfuladdright").fadeIn("slow") 
 					})
 				})
 			})
 		})
	})





//Compare function:
	function compareAndHighlight() {
	//Variables to see who is better
		var left = 0;
		var right = 0;

	//Save all things to compare to variables
		//Grab Name
		var leftName = $("#nameplayerleft").html();
		var rightName = $("#nameplayerright").html();
		//(and parseInt)
		//Points
		var leftPoints = parseInt($("#pointsplayerleft").html());
		var rightPoints = parseInt($("#pointsplayerright").html());
		//Assists
		var leftAssists = parseInt($("#assistsplayerleft").html());
		var rightAssists = parseInt($("#assistsplayerright").html());
		//Rebounds
		var leftRebounds = parseInt($("#reboundsplayerleft").html());
		var rightRebounds = parseInt($("#reboundsplayerright").html());
		//Steals
		var leftSteals = parseInt($("#stealsplayerleft").html());
		var rightSteals = parseInt($("#stealsplayerright").html());
		//Blocks
		var leftBlocks = parseInt($("#blocksplayerleft").html());
		var rightBlocks = parseInt($("#blocksplayerright").html());
		//Score and save to variables
		var leftScore = parseInt($("#scoreplayerleft").html());
		var rightScore = parseInt($("#scoreplayerright").html());

		

	//Compare Points
		if(leftPoints > rightPoints) {
			$("#pointsplayerleft").addClass("green");
			$("#pointsplayerleft").removeClass("red");
			$("#pointsplayerright").addClass("red");
			$("#pointsplayerright").removeClass("green");
			left += 1;
		} else if (leftPoints < rightPoints) {
			$("#pointsplayerleft").addClass("red");
			$("#pointsplayerleft").removeClass("green");
			$("#pointsplayerright").addClass("green");
			$("#pointsplayerright").removeClass("red");
			right += 1;
		} else if (leftPoints = rightPoints) {
			$("#pointsplayerleft").addClass("backgroundleft");
			$("#pointsplayerleft").removeClass("green");
			$("#pointsplayerleft").removeClass("red");
			$("#pointsplayerright").addClass("backgroundright");
			$("#pointsplayerright").removeClass("red");
			$("#pointsplayerright").removeClass("green");
		}	

	//Compare Assists
		if(leftAssists > rightAssists) {
			$("#assistsplayerleft").addClass("green");
			$("#assistsplayerleft").removeClass("red");
			$("#assistsplayerright").addClass("red");
			$("#assistsplayerright").removeClass("green");
			left += 1;
		} else if (leftAssists < rightAssists) {
			$("#assistsplayerleft").addClass("red");
			$("#assistsplayerleft").removeClass("green");
			$("#assistsplayerright").addClass("green");
			$("#assistsplayerright").removeClass("red");
			right += 1;
		} else if (leftAssists = rightAssists) {
			$("#assistsplayerleft").addClass("backgroundleft");
			$("#assistsplayerleft").removeClass("green");
			$("#assistsplayerleft").removeClass("red");
			$("#assistsplayerright").addClass("backgroundright");
			$("#assistsplayerright").removeClass("red");
			$("#assistsplayerright").removeClass("green");
		}

	//Compare Rebounds
		if(leftRebounds > rightRebounds) {
			$("#reboundsplayerleft").addClass("green");
			$("#reboundsplayerleft").removeClass("red");
			$("#reboundsplayerright").addClass("red");
			$("#reboundsplayerright").removeClass("green");
			left += 1;
		} else if (leftRebounds < rightRebounds) {
			$("#reboundsplayerleft").addClass("red");
			$("#reboundsplayerleft").removeClass("green");
			$("#reboundsplayerright").addClass("green");
			$("#reboundsplayerright").removeClass("red");
			right += 1;
		} else if (leftRebounds = rightRebounds) {
			$("#reboundsplayerleft").addClass("backgroundleft");
			$("#reboundsplayerleft").removeClass("green");
			$("#reboundsplayerleft").removeClass("red");
			$("#reboundsplayerright").addClass("backgroundright");
			$("#reboundsplayerright").removeClass("red");
			$("#reboundsplayerright").removeClass("green");
		}

	//Compare Steals

		if(leftSteals > rightSteals) {
			$("#stealsplayerleft").addClass("green");
			$("#stealsplayerleft").removeClass("red");
			$("#stealsplayerright").addClass("red");
			$("#stealsplayerright").removeClass("green");
			left += 1;
		} else if (leftSteals < rightSteals) {
			$("#stealsplayerleft").addClass("red");
			$("#stealsplayerleft").removeClass("green");
			$("#stealsplayerright").addClass("green");
			$("#stealsplayerright").removeClass("red");
			right += 1;
		} else if (leftSteals = rightSteals) {
			$("#stealsplayerleft").addClass("backgroundleft");
			$("#stealsplayerleft").removeClass("green");
			$("#stealsplayerleft").removeClass("red");
			$("#stealsplayerright").addClass("backgroundright");
			$("#stealsplayerright").removeClass("red");
			$("#stealsplayerright").removeClass("green");
		}

	//Compare Blocks

		if(leftBlocks > rightBlocks) {
			$("#blocksplayerleft").addClass("green");
			$("#blocksplayerleft").removeClass("red");
			$("#blocksplayerright").addClass("red");
			$("#blocksplayerright").removeClass("green");
			left += 1;
		} else if (leftBlocks < rightBlocks) {
			$("#blocksplayerleft").addClass("red");
			$("#blocksplayerleft").removeClass("green");
			$("#blocksplayerright").addClass("green");
			$("#blocksplayerright").removeClass("red");
			right += 1;
		} else if (leftBlocks = rightBlocks) {
			$("#blocksplayerleft").addClass("backgroundleft");
			$("#blocksplayerleft").removeClass("green");
			$("#blocksplayerleft").removeClass("red");
			$("#blocksplayerright").addClass("backgroundright");
			$("#blocksplayerright").removeClass("red");
			$("#blocksplayerright").removeClass("green");
		}

	//Compare Score

		if(leftScore > rightScore) {
			$("#scoreplayerleft").addClass("green");
			$("#scoreplayerleft").removeClass("red");
			$("#scoreplayerright").addClass("red");
			$("#scoreplayerright").removeClass("green");
			left += 1;
		} else if (leftScore < rightScore) {
			$("#scoreplayerleft").addClass("red");
			$("#scoreplayerleft").removeClass("green");
			$("#scoreplayerright").addClass("green");
			$("#scoreplayerright").removeClass("red");
			right += 1;
		} else if (leftScore = rightScore) {
			$("#scoreplayerleft").addClass("backgroundleft");
			$("#scoreplayerleft").removeClass("green");
			$("#scoreplayerleft").removeClass("red");
			$("#scoreplayerright").addClass("backgroundright");
			$("#scoreplayerright").removeClass("red");
			$("#scoreplayerright").removeClass("green");
		}





	//Compare Overall
		if(left > right) {
			$("#nameplayerleft").addClass("green");
			$("#nameplayerleft").removeClass("red");
			$("#nameplayerright").addClass("red");
			$("#nameplayerright").removeClass("green");
		} else if (left < right) {
			$("#nameplayerleft").addClass("red");
			$("#nameplayerleft").removeClass("green");
			$("#nameplayerright").addClass("green");
			$("#nameplayerright").removeClass("red");
		} else if (left = right) {
			$("#nameplayerleft").addClass("backgroundleft");
			$("#nameplayerleft").removeClass("green");
			$("#nameplayerleft").removeClass("red");
			$("#nameplayerright").addClass("backgroundright");
			$("#nameplayerright").removeClass("red");
			$("#nameplayerright").removeClass("green");
		}

	}

	function clearWhenHidden() {
		//Clear Colors if One Side is Empty
			if($("#hiddenstatsleft-newplayer").attr("style") === 'display: none;') {
				$("#nameplayerright").removeClass("green red")
				$("#pointsplayerright").removeClass("green red")
				$("#assistsplayerright").removeClass("green red")
				$("#reboundsplayerright").removeClass("green red")
				$("#stealsplayerright").removeClass("green red")
				$("#blocksplayerright").removeClass("green red")
				$("#scoreplayerright").removeClass("green red")
			}

			if($("#hiddenstatsright-newplayer").attr("style") === 'display: none;') {
				$("#nameplayerleft").removeClass("green red")
				$("#pointsplayerleft").removeClass("green red")
				$("#assistsplayerleft").removeClass("green red")
				$("#reboundsplayerleft").removeClass("green red")
				$("#stealsplayerleft").removeClass("green red")
				$("#blocksplayerleft").removeClass("green red")
				$("#scoreplayerleft").removeClass("green red")
			}
	}

//Auto complete script

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
	  //Left
	  $("#firstnameinputleft-newplayer").keyup(dropDownFirstLeft);
	  $("#lastnameinputleft-newplayer").keyup(dropDownLastLeft);

	  //Right
	  $("#firstnameinputright-newplayer").keyup(dropDownFirstRight);
	  $("#lastnameinputright-newplayer").keyup(dropDownLastRight);
	});



//Left half
	function dropDownFirstLeft() {
		var firstSearch = $("#firstnameinputleft-newplayer").val()
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

		$("#leftsearchresults").html(firstOutput)
		$("#leftcomplete").show()
	}

	function dropDownLastLeft() {
		var lastSearch = $("#lastnameinputleft-newplayer").val()
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

		$("#leftsearchresults").html(lastOutput)
		$("#leftcomplete").show()
	}

	//Event listener for when the particular li is clicked
	$("#leftsearchresults").on("click", "li", function(e) {
		$(".autocomplete").hide()
		$("#submitplayerleft").focus()
		//Get the name, split it and then put the parts into the the input fields
		var fullName = $(this).html();
		var nameSplit = fullName.split(" ");
		$("#firstnameinputleft-newplayer").val(nameSplit[0])
		$("#lastnameinputleft-newplayer").val(nameSplit[1])
	})


//Right half
	function dropDownFirstRight() {
		var firstSearch = $("#firstnameinputright-newplayer").val()
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

		$("#rightsearchresults").html(firstOutput)
		$("#rightcomplete").show()
	}

	function dropDownLastRight() {
		var lastSearch = $("#lastnameinputright-newplayer").val()
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

		$("#rightsearchresults").html(lastOutput)
		$("#rightcomplete").show()
	}

	//Event listener for when the particular li is clicked
	$("#rightsearchresults").on("click", "li", function(e) {
		$(".autocomplete").hide()
		$("#submitplayerright").focus()
		//Get the name, split it and then put the parts into the the input fields
		var fullName = $(this).html();
		var nameSplit = fullName.split(" ");
		$("#firstnameinputright-newplayer").val(nameSplit[0])
		$("#lastnameinputright-newplayer").val(nameSplit[1])
	})











})




















