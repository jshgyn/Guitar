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

// -------- PEDAL --------------------------------
	var fxcontrol_delay = 1;
	var fxcontrol_drive = 1;
	// add pedal
	function addPedal (type) {
		switch (type)	
		{
			case "delay" :
				var js = document.createElement("script");
				js.type = "text/javascript";
				js.src = "js/fx_delay.js";
				document.body.appendChild(js);
				fxcontrol_drive = 1;
				break;	
			case "drive" :
				var js = document.createElement("script");
				js.type = "text/javascript";
				js.src = "js/fx_drive.js";
				document.body.appendChild(js);
				fxcontrol_drive = 1;
				break;			
		}

	}

// -------- END --------------------------------
});
