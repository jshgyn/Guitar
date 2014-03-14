$( document ).ready(function() {

	$(".loop_countdown").hide();
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


	// -------- UI -------------------------------
	$("#loop_startstop").click(function() {	
		if (startOrStop=="start")
		{
			loopStart();
			updateLoopLight("green");
			updateLoopStartStop("stop");
		}
		else if (startOrStop=="stop")
		{
			loopStop();
			updateLoopLight("off");
			updateLoopStartStop("start");
		}

	});

});
var startOrStop = "stop";
// -------- UI -------------------------------
function updateBPMText(averageTap) {
	var averageBPM = Math.round(60000/averageTap);
	document.getElementById("loop_bpm").innerHTML = averageBPM+"<i>bpm</i>";
}
function updateCountdownText(count, clear) {
	if (clear==true)
	{
		document.getElementById("loop_countdown").innerHTML = "";
		$(".loop_countdown").hide();
	}
	else
	{
		document.getElementById("loop_countdown").innerHTML = count;
		$(".loop_countdown").show();
	}
}
function updateLoopLight(colour) {
	// alert(colour);
	if (colour=="red") {  $('.loop_light').css('background-image', 'url(img/loop_light_red.png)'); }
	else if (colour=="green") {  $('.loop_light').css('background-image', 'url(img/loop_light_green.png)'); updateLoopStartStop("stop");}
	else if (colour=="off") {  $('.loop_light').css('background-image', 'url(img/loop_light_bw.png)'); updateLoopStartStop("start");}
}
function updateLoopStartStop(i) {
	if (i=="start"){ 
		document.getElementById("loop_startstop").innerHTML = "Start";
		startOrStop = "start"; 
	}
	else if (i=="stop"){ 
		document.getElementById("loop_startstop").innerHTML = "Stop";
		startOrStop = "stop"; 
	}
}