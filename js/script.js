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
	var fxcontrol_delay = 0;
	var fxcontrol_drive = 0;
	// add pedal
	function addPedal (type) {
		switch (type)	
		{
			case "delay" :
				$.get("pedal_delay.html", function(data){
			    	$(".pedal_section").append(data);
			   		$( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });
				});
				if (fxcontrol_delay==0)
				{
					var js = document.createElement("script");
					js.type = "text/javascript";
					js.src = "js/fxcontrol_delay.js";
					document.body.appendChild(js);
					fxcontrol_delay = 1;
				}
				break;
			case "drive" :
				$.get("pedal_drive.html", function(data){
			    	$(".pedal_section").append(data);
			   		$( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });
				});
				if (fxcontrol_drive==0)
				{
					var js = document.createElement("script");
					js.type = "text/javascript";
					js.src = "js/fxcontrol_drive.js";
					document.body.appendChild(js);
					fxcontrol_drive = 1;
				}
				break;
				
		}

	}

// -------- END --------------------------------
});
