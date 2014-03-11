$( document ).ready(function() {

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