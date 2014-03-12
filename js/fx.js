window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var audioInput = null;
var dryGain = null;
var wetGain = null;
var wetGainVal = 1;   

// --------- Delay ---------------------------------------------------------------------------

// var delayActive = false;
// var delayController = null;

// var delayNode = null;
// var delayGainNode = null;

// var delayTime = 0.1;
// var delayFeedback = 0.1;

// function createDelay() {
//     delayNode = audioContext.createDelay();
//     delayNode.delayTime.value = delayTime;

//     delayGainNode = audioContext.createGain();
//     delayGainNode.gain.value = delayFeedback;

//     delayGainNode.connect( delayNode );
//     delayNode.connect( delayGainNode );
//     delayNode.connect( wetGain );

//     delayActive = true;
//     return delayNode;
// }

// function updateDelay(x, val) {
//     if (delayActive)
//     {
//         switch (x)
//         {
//             case "t":
//                 delayTime = val/360;
//                 delayNode.delayTime.value = delayTime;
//                 break;
//             case "v":
//                 wetGainVal = val/360;
//                 wetGain.gain.value = wetGainVal;
//                 if (wetGain.gain.value > 1) { wetGain.gain.value = 1; }
//                 break;
//             case "f":
//                 delayFeedback = val/360;
//                 delayGainNode.gain.value = delayFeedback;
//                 if (delayGainNode.gain.value > 1) { delayGainNode.gain.value = 1; }
//                 break;
//         }
//     }
//     // removeEffect("delay");
//     // addEffect("delay"); 
// }

// function restartDelay() {
//     if (delayActive) { 
//         removeEffect("delay");
//         addEffect("delay");
//     }
// }


function Delay() {
    var self = this;
    self.setTime = function(newDelayTime) {
        self.delayTime = newDelayTime;
        self.delayNode.delayTime.value = self.delayTime;
    }
    self.setVolume = function(newDelayVolume) {
        self.delayVolume = newDelayVolume;
        wetGain.gain.value = self.delayVolume;
        if (wetGain.gain.value > 1) { wetGain.gain.value = 1; }
    }
    self.setFeedback = function(newDelayFeedback) {
        self.delayFeedback = newDelayFeedback;
        self.delayGainNode.gain.value = self.delayFeedback;
        if (self.delayGainNode.gain.value > 1) { self.delayGainNode.gain.value = 1; }
    }
    self.delayOn = function () {
        self.delayNode = audioContext.createDelay();
        self.delayNode.delayTime.value = self.delayTime;

        self.delayGainNode = audioContext.createGain();
        self.delayGainNode.gain.value = self.delayFeedback;

        self.delayGainNode.connect( self.delayNode );
        self.delayNode.connect( self.delayGainNode );
        self.delayNode.connect( wetGain );

        self.delayActive = true;
        audioInput.connect( self.delayNode );
        $(self.lightDiv).show();
    }
    self.delayOff = function() {
        self.delayNode.disconnect(0);
        self.delayActive = false;
        $(self.lightDiv).hide();
    }
    self.delayRestart = function () {
        self.delayOff();
        self.delayOn();
    }

    self.delayToggle = function () {
        if (self.delayActive != true)
        {
            self.delayOn();
        }
        else 
        {
            self.delayOff();
        }
    }

    self.setUpDelay = function() {

        self.delayTime = 0.1;
        self.delayFeedback = 0.1;
        wetGainVal = 1;

        
        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal delay_pedal";
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background delay_background";
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light delay_light";
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch delay_switch";
        this.switchDiv.addEventListener('click', this.delayToggle);
        this.timeKnobDiv = document.createElement("div"); this.timeKnobDiv.className = "knob delay_time";
        $(this.timeKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayTimeOffset = 335; var delayTimeOffsetSet = 1;}
                if (this.angle>0) { var delayTimeOffset = 25; var delayTimeOffsetSet = 1;}
            // }
            var angle = this.angle + delayTimeOffset;
            var newDelayTime = (angle/360);
            self.setTime(newDelayTime);
            console.log(newDelayTime);
        }});
        this.volumeKnobDiv = document.createElement("div"); this.volumeKnobDiv.className = "knob delay_volume";
        $(this.volumeKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayVolumeOffset = 335; var delayVolumeOffsetSet = 1;}
                if (this.angle>0) { var delayVolumeOffset = 25; var delayVolumeOffsetSet = 1;}
            // }
            var angle = this.angle + delayVolumeOffset;
            var newDelayVolume = (angle/360);
            self.setVolume(newDelayVolume);
            console.log(newDelayVolume);
        }});

        this.feedbackKnobDiv = document.createElement("div"); this.feedbackKnobDiv.className = "knob delay_feedback";
        $(this.feedbackKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayFeedbackOffset = 335; var delayFeedbackOffsetSet = 1;}
                if (this.angle>0) { var delayFeedbackOffset = 25; var delayFeedbackOffsetSet = 1;}
            // }
            var angle = this.angle + delayFeedbackOffset;
            var newDelayFeedback = (angle/360);
            self.setFeedback(newDelayFeedback);
            console.log(newDelayFeedback);
        }});

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.timeKnobDiv);
        $(this.containerDiv).append(this.volumeKnobDiv);
        $(this.containerDiv).append(this.feedbackKnobDiv);
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        this.pedalSetup = true;
        return this.pedalID;
    }

    if (this.pedalSetup != true) { this.setUpDelay(); }
    this.delayToggle();
}


// --------- Drive ---------------------------------------------------------------------------

function Drive() {
    var self = this;
    self.setDrive = function(newDriveAmount) {
        self.driveAmount = newDriveAmount;
        self.driveNode.setDrive(self.driveAmount);
    }

    self.driveToggle = function () {
        if (self.driveActive != true)
        {
            self.driveNode = new WaveShaper( audioContext );
            self.driveNode.output.connect( wetGain );
            self.driveNode.output.connect( dryGain );
            self.driveNode.setDrive(self.driveAmount);
            self.driveActive = true;
            audioInput.connect( self.driveNode.input );
            $(self.lightDiv).show();
        }
        else 
        {
            self.driveNode.input.disconnect(0);
            self.driveActive = false;
            $(self.lightDiv).hide();
        }
    }
    self.setUpDrive = function() {
        this.driveAmount = 50.0;

        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal drive_pedal";
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background drive_background";
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light drive_light";
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch drive_switch";
        this.switchDiv.addEventListener('click', this.driveToggle);
        this.knobDiv = document.createElement("div"); this.knobDiv.className = "knob drive_amount";
        $(this.knobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var driveAmountOffset = 335; var driveAmountOffsetSet = 1;}
                if (this.angle>0) { var driveAmountOffset = 25; var driveAmountOffsetSet = 1;}
            // }
            var angle = this.angle + driveAmountOffset;
            var newDriveAmount = (angle/360)*100;
            self.setDrive(newDriveAmount);
            console.log(newDriveAmount);
        }});

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.knobDiv);
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        this.pedalSetup = true;
        return this.pedalID;
    }

    if (this.pedalSetup != true) { this.setUpDrive(); }
    this.driveToggle();
}


// --------- MAIN ---------------------------------------------------------------------------

function audioStream(stream) {
    // Create an AudioNode from the stream.
    audioInput = audioContext.createMediaStreamSource( stream );
    // Connect it to the destination to hear yourself (or any other node for processing!)
 
    dryGain = audioContext.createGain();
    audioInput.connect(dryGain);
    wetGain = audioContext.createGain();  
    audioInput.connect(wetGain);

    dryGain.connect( audioContext.destination );
    wetGain.connect( audioContext.destination );
}

function addPedal (type) {
    switch (type)   
    {
        case "delay" :
            new Delay();
            break;  
        case "drive" :

            new Drive();

            break;          
    }

}

function setUp() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( {audio:true}, audioStream );
}

$( document ).ready(function() {
    setUp();
});