$( document ).ready(function() {

	$(".loop_countdown").hide();
// -------- MENU --------------------------------
	// showMenu();
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

	$("#test").click(function() {
		location.reload();
	});

	// -------- UI -------------------------------
	$("#loop_startstop").click(function() {	
		if (loopStartOrStop=="start")
		{
			loopStart();
			updateLoopLight("green");
			updateLoopStartStop("stop");
		}
		else if (loopStartOrStop=="stop")
		{
			loopStop();
			updateLoopLight("off");
			updateLoopStartStop("start");
		}
	});

	$('select').on('change', function() {
		document.getElementById("loop_bar_display").innerHTML = "Bars: " + this.value;
		changeBars(this.value);
	});


    var fileIn = $('#fileIn')[0];
    $(fileIn).change(function () {
    	document.getElementById('backingPlayer').src = window.URL.createObjectURL(fileIn.files[0]);
    });

	$("#backing_startstop").click(function() {	
		if (backingStartOrStop=="start")
		{
			backingStart();
			backingStartOrStop = "stop";
		}
		else if (backingStartOrStop=="stop")
		{
			backingStop();
			backingStartOrStop = "start";
		}	
	});

	function backingStart() {
	    document.getElementById('backingPlayer').currentTime = 0;   
	    document.getElementById('backingPlayer').play(); 
	    $('#backing_startstop').css('background-color', '#0f0');   
	}
	function backingStop() {
	    document.getElementById('backingPlayer').pause();           
	    $('#backing_startstop').css('background-color', '#000');   
	}

});
var loopStartOrStop = "stop";
var backingStartOrStop = "start";
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
		loopStartOrStop = "start"; 
	}
	else if (i=="stop"){ 
		document.getElementById("loop_startstop").innerHTML = "Stop";
		loopStartOrStop = "stop"; 
	}
	else if (i=="clear"){ 
		document.getElementById("loop_startstop").innerHTML = "";
	}
}

