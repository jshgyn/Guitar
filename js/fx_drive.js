$( document ).ready(function() {

	var thisHtml = '<div class="pedal" id="drive_pedal">' +					
						'<div class="background" id="drive_background"></div>' +
						'<div class="light" id="drive_light"></div>' +
						'<div class="switch" id="drive_onoff"></div>' +
						'<div class="knob" id="drive_amount"></div>' +
					'</div>';
	$(".pedal_section").append(thisHtml);
	$( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });



	// -------------------- drive --------------------
	var driveOn = 0;
	$("#drive_onoff").click(function(){
		if (driveOn==0) { 
			addEffect("drive"); 
			driveOn = 1; 
			$("#drive_light").show();
		}
		else { 
			removeEffect("drive");
			driveOn = 0; 
			$("#drive_light").hide();
		}
	});

	var driveAmountOffset = 0;
	var driveAmountOffsetSet = 0;

	$("#drive_amount").propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
		if (driveAmountOffsetSet==0)
		{
			if (this.angle<0) { driveAmountOffset = 335; driveAmountOffsetSet = 1;}
			if (this.angle>0) { driveAmountOffset = 25; driveAmountOffsetSet = 1;}
		}
		var angle = this.angle + driveAmountOffset;
		updateDrive("d", angle);
		console.log(angle)
	}});

});