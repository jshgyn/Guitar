window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var audioInput = null;
var dryGain = null;
var wetGain = null;
var wetGainVal = 1;  

var toReset = new Array(); 
var latestNode = null; 

// --------- Delay ---------------------------------------------------------------------------

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

        wetGain.connect(self.delayNode);
        self.delayNode.connect( audioContext.destination );
        latestNode.connect(self.delayNode);
        self.delayNode.connect( audioContext.destination );
        latestNode = self.delayNode;

        self.delayActive = true;
        audioInput.connect( self.delayNode );
        $(self.lightDiv).show();
    }
    self.delayOff = function() {
        self.delayNode.disconnect(0);
        self.delayGainNode.disconnect(0);
        self.delayActive = false;
        $(self.lightDiv).hide();
    }
    self.restart = function () {
        if (self.delayActive==true)
        {   
            self.delayOff();
            self.delayOn();
        }
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
        toReset[toReset.length] = self;

        
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
            // self.driveNode.output.connect( wetGain );
            // self.driveNode.output.connect( dryGain );

            latestNode.connect(self.driveNode.output);
            self.driveNode.output.connect(audioContext.destination);
            latestNode = self.driveNode.output;

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

        for (i=0;i<toReset.length;i++)
        {
            toReset[i].restart();
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

// --------- Drive ---------------------------------------------------------------------------

function Radio() {
    var self = this;

    self.radioToggle = function () {
        if (self.radioActive != true)
        {
            self.radioLPNode1  = audioContext.createBiquadFilter();
            self.radioLPNode1.type = self.radioLPNode1.LOWPASS;
            self.radioLPNode1.frequency.value = 2500.0;
            self.radioHPNode1  = audioContext.createBiquadFilter();
            self.radioHPNode1.type = self.radioHPNode1.HIGHPASS;
            self.radioHPNode1.frequency.value = 300.0;
            self.radioLPNode2  = audioContext.createBiquadFilter();
            self.radioLPNode2.type = self.radioLPNode2.LOWPASS;
            self.radioLPNode2.frequency.value = 2500.0;
            self.radioHPNode2  = audioContext.createBiquadFilter();
            self.radioHPNode2.type = self.radioHPNode2.HIGHPASS;
            self.radioHPNode2.frequency.value = 300.0;


            latestNode.connect(self.radioLPNode1);
            self.radioLPNode1.connect(self.radioHPNode1);
            self.radioHPNode1.connect(self.radioLPNode2);
            self.radioLPNode2.connect(self.radioHPNode2);
            self.radioHPNode2.connect(audioContext.destination);
            latestNode = self.radioHPNode2;

            self.radioActive = true;
            audioInput.connect( self.radioLPNode1 );
            audioInput.connect( self.radioLPNode2 );
            audioInput.connect( self.radioHPNode1 );
            audioInput.connect( self.radioHPNode2 );
            $(self.lightDiv).show();
        }
        else 
        {
            self.radioLPNode1.disconnect(0);
            self.radioHPNode1.disconnect(0);
            self.radioActive = false;
            $(self.lightDiv).hide();
        }

        for (i=0;i<toReset.length;i++)
        {
            toReset[i].restart();
        }
    }
    self.setUpRadio = function() {

        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal drive_pedal";
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background drive_background";
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light drive_light";
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch drive_switch";
        this.switchDiv.addEventListener('click', this.radioToggle);

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.knobDiv);
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        this.pedalSetup = true;
        return this.pedalID;
    }

    if (this.pedalSetup != true) { this.setUpRadio(); }
    this.radioToggle();
}

// --------- LOOPER ---------------------------------------------------------------------------
var recorder;
var recording = false;
function recStart() {
  recorder = new Recorder(latestNode);
  recorder.record();
  recording = true;
}
function recStop() {
  recorder.stop();
  recording = false;
  recorder.exportWAV(function(s) {
    document.getElementById('loopPlayer').src = window.URL.createObjectURL(s);
  });
}

function loopStop() {
    document.getElementById('loopPlayer').pause();
    document.getElementById('loopPlayer').currentTime = 0;     
}
function loopStart() {
    document.getElementById('loopPlayer').play();
}

$(window).keypress(function(e) {
    if (e.which === 32) {
        if (recording==true)
        {
            recStop();
        }
        else
        {
            recStart();
        }
    }
});

// --------- MAIN ---------------------------------------------------------------------------

function audioStream(stream) {
    // Create an AudioNode from the stream.
    audioInput = audioContext.createMediaStreamSource( stream );
    // Connect it to the destination to hear yourself (or any other node for processing!)
 
    dryGain = audioContext.createGain();
    audioInput.connect(dryGain);
    latestNode = dryGain;
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
        case "radio" :
            new Radio();
            break;         
    }

}

function setUp() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia( {audio:true}, audioStream );
}

$( document ).ready(function() {
    setUp();
});