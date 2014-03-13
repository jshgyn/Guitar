$( document ).ready(function() {

// -------- MENU --------------------------------
	showMenu();
	// show menu
	function showMenu() {
		$("#show_menu").animate({width:"0px"}, 100, function() {
			$(".left_section").show();
			$(".left_section").animate({width: "20%"}, 100);
		});
	}
	$("#show_menu").click(function(){ showMenu(); });

	// hide menu
	function hideMenu() {
		$(".left_section").animate({width: "0%"}, 100, function() {
			$(".left_section").hide();
			$("#show_menu").animate({width:"20px"}, 100);
		});
	}
	$("#hide_menu").click(function(){ hideMenu(); });

	// menu item actions
	$("#new_delay").click(function() {	
		addPedal("delay");
	});
	$("#new_drive").click(function() {	
		addPedal("drive");
	});
	$("#new_radio").click(function() {	
		addPedal("radio");
	});

	$("#rec_start").click(function() {	
		recStart();
	});
	$("#rec_stop").click(function() {	
		recStop();
	});
	$("#loop_stop").click(function() {	
		loopStop();
	});
	$("#loop_start").click(function() {	
		loopStart();
	});	
// -------- END --------------------------------
});
