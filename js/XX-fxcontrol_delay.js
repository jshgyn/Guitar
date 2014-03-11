$( document ).ready(function() {


	// -------------------- delay --------------------
	var delayOn = 0;
	$("#delay_onoff").click(function(){
		if (delayOn==0) { 
			addEffect("delay"); 
			delayOn = 1; 
			$("#delay_light").show();
		}
		else { 
			removeEffect("delay");
			delayOn = 0; 
			$("#delay_light").hide();
		}
	});

	var delayTimeOffset = 0;
	var delayTimeOffsetSet = 0;
	var delayFeedbackOffset = 0;
	var delayFeedbackOffsetSet = 0;	
	$("#delay_time").propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
		if (delayTimeOffsetSet==0)
		{
			if (this.angle<0) { delayTimeOffset = 335; delayTimeOffsetSet = 1;}
			if (this.angle>0) { delayTimeOffset = 25; delayTimeOffsetSet = 1;}
		}
		var angle = this.angle + delayTimeOffset;
		updateDelay("t", angle);
		console.log(angle)
	}});
	$("#delay_volume").propeller({inertia: 0, speed: 0, step: 5, onRotate: function() {
		updateDelay("v", this.angle);
	}});
	$("#delay_feedback").propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
		if (delayFeedbackOffsetSet==0)
		{
			if (this.angle<0) { delayFeedbackOffset = 335; delayFeedbackOffsetSet = 1;}
			if (this.angle>0) { delayFeedbackOffset = 25; delayFeedbackOffsetSet = 1;}
		}
		var angle = this.angle + delayFeedbackOffset;
		updateDelay("f", angle);
		console.log(angle)
	}});		
});