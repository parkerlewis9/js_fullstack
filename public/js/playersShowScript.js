$(document).ready(function() {

//Ajax call to get data
	$.ajax({
			url: window.location.pathname,
			method: "GET",
			dataType: "json"
//Put data in to the array in data and then make the chart
		}).done(function(player) {
			console.log(player)
			makeBarGraph(player, function() {
				var myBarChart = new Chart(ctx).Bar(data, options);	
			})
		})

//Set up context for the canvas
	var ctx = $("#myChart").get(0).getContext("2d");


//Function to make the graph after the data has been loaded to the data object's data array
	function makeBarGraph(player, callback) {

		data.datasets[0].data.push(player.player.points);
		data.datasets[0].data.push(player.player.assists);
		data.datasets[0].data.push(player.player.rebounds);
		data.datasets[0].data.push(player.player.steals);
		data.datasets[0].data.push(player.player.blocks);
		return callback();
	}


	var data = {
	    labels: ["Points", "Assists", "Rebounds", "Steals", "Blocks"],
	    datasets: [
	        {
	            label: "Player's Stats",
	            fillColor: "rgba(151,187,205,0.5)",
	            strokeColor: "rgba(151,187,205,0.8)",
	            highlightFill: "rgba(151,187,205,0.75)",
	            highlightStroke: "rgba(151,187,205,1)",
	            data: []
	        }
	    ]
	};

	var options = {
				    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
				    scaleBeginAtZero : true,

				    //Boolean - Whether grid lines are shown across the chart
				    scaleShowGridLines : true,

				    //String - Colour of the grid lines
				    scaleGridLineColor : "rgba(0,0,0,.05)",

				    //Number - Width of the grid lines
				    scaleGridLineWidth : 1,

				    //Boolean - Whether to show horizontal lines (except X axis)
				    scaleShowHorizontalLines: true,

				    //Boolean - Whether to show vertical lines (except Y axis)
				    scaleShowVerticalLines: true,

				    //Boolean - If there is a stroke on each bar
				    barShowStroke : true,

				    //Number - Pixel width of the bar stroke
				    barStrokeWidth : 2,

				    //Number - Spacing between each of the X value sets
				    barValueSpacing : 5,

				    //Number - Spacing between data sets within X values
				    barDatasetSpacing : 1,

				    //String - A legend template
				    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

				}
	// makeBarGraph(function() {
	// 	var myBarChart = new Chart(ctx).Bar(data, options);	
	// })
	



})