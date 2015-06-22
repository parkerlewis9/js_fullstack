$(document).ready(function() {



	$("#player1-form").on("submit", function(e) {
		e.preventDefault();
		var firstName = $("#player1first").val();
		var lastName = $("#player1last").val();
		var url = "https://probasketballapi.com/players?api_key=SoBO1Is4dA2cpkR0J9mlMgbftZv5wzNu&first_name=" + firstName + "&last_name=" + lastName;
//First request to get id:
		$.post( url , function( data ) {
		  var data = JSON.parse(data)
		  var player_id = data[0].player_id;
		  var newUrl = "https://probasketballapi.com/stats/players?api_key=SoBO1Is4dA2cpkR0J9mlMgbftZv5wzNu&player_id=" + player_id;
//Request to get data:
		  $.post( newUrl , function( data ) {
		    console.log(data)
		  });	
		});

	})

	//TODO --- Make one function to search for results

})