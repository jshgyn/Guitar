$( document ).ready(function() {

// -------- MENU --------------------------------

	// show menu
	$("#show_menu").click(function() {
		$("#show_menu").animate({width:"0px"}, 100, function() {
			$(".left_section").show();
			$(".left_section").animate({width: "20%"}, 100);
		});
	});

	// hide menu
	$("#hide_menu").click(function() {
		$(".left_section").animate({width: "0%"}, 100, function() {
			$(".left_section").hide();
			$("#show_menu").animate({width:"20px"}, 100);
		});
	});

	// menu item actions
	$("#new_pedal").click(function() {	
		addPedal();
	});

// -------- PEDAL --------------------------------

	// pedal movement
	$(function() {
	    $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false });
	 });

	// add pedal
	function addPedal () {	
		$.get("pedal.html", function(data){
	    	$(".pedal_section").append(data);
	   		$( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false });
		}); 
	}

// -------- END --------------------------------
});
