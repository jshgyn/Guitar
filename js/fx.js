window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var audioInput = null;
var dryGain = null;
var wetGain = null;
var wetGainVal = 1;  

var pedalID = 0; 
var toReset = new Array(); 
var latestNode = null; 

// --------- Delay ---------------------------------------------------------------------------

function Delay() {
    var self = this;
    self.setTime = function(newDelayTime) {
        newDelayTime = newDelayTime/100;
        if (newDelayTime==0) { newDelayTime==1; }
        self.delayTime = newDelayTime;
        self.delayNode.delayTime.value = self.delayTime;
    }
    self.setVolume = function(newDelayVolume) {
        newDelayVolume = newDelayVolume/100;
        // if (newDelayFeedback==0) { newDelayFeedback==1; }
        self.delayFeedback = newDelayVolume;
        self.delayGainNode.gain.value = self.delayFeedback;
        if (self.delayGainNode.gain.value > 1) { self.delayGainNode.gain.value = 1; }
    }
    self.setFeedback = function(newDelayFeedback) {
        newDelayFeedback = newDelayFeedback/100;
        if (newDelayFeedback==0) { newDelayFeedback==1; }
        self.delayVolume = newDelayFeedback;
        wetGain.gain.value = self.delayVolume;
        if (wetGain.gain.value > 1) { wetGain.gain.value = 1; }
    }

    self.hideControls = function () {
        self.timeKnobDiv.style.display = 'none';
        self.volumeKnobDiv.style.display = 'none';
        self.feedbackKnobDiv.style.display = 'none';
        self.timeSliderDiv.style.display = 'none';
        self.volumeSliderDiv.style.display = 'none';
        self.feedbackSliderDiv.style.display = 'none';
    }
    self.showKnobs = function () {
        self.timeKnobDiv.style.display = 'block';
        self.volumeKnobDiv.style.display = 'block';
        self.feedbackKnobDiv.style.display = 'block';
    }
    self.showSliders = function () {
        self.timeSliderDiv.style.display = 'block';
        self.volumeSliderDiv.style.display = 'block';
        self.feedbackSliderDiv.style.display = 'block';
    }

    self.changeControls = function (type) {
        switch (type)   
        {
            case "knobs" :
                self.hideControls();
                self.showKnobs();
                self.controlType = type;
                break;  
            case "sliders" :
                self.hideControls();
                self.showSliders();
                self.controlType = type;
                break; 
        }
    }
    self.toggleControls = function() {
        switch (self.controlType)   
        {
            case "knobs" :
                self.changeControls("sliders");
                break;  
            case "sliders" :
                self.changeControls("knobs");                
                break; 
        }
    }
 
    self.delayOn = function () {

        self.delayNode.delayTime.value = self.delayTime;

        self.delayGainNode.gain.value = self.delayFeedback;
        wetGain.connect(self.delayNode);
        // self.delayNode.connect( audioContext.destination );

        self.delayNode.connect( audioContext.destination );

        self.delayActive = true;
        // audioInput.connect( self.delayNode );
        $(self.lightDiv).show();
    }
    self.delayOff = function() {
        self.delayNode.disconnect(0);
        // self.delayGainNode.disconnect(0);
        // wetGain.disconnect(0);
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

        pedalID ++;
        this.pedalID = pedalID;

        self.delayTime = 0.1;
        self.delayFeedback = 0.1;
        wetGainVal = 1;
        toReset[toReset.length] = self;

        self.delayNode = audioContext.createDelay();
        self.delayNode.delayTime.value = self.delayTime;

        self.delayGainNode = audioContext.createGain();
        self.delayGainNode.gain.value = self.delayFeedback;

        self.delayGainNode.connect( self.delayNode );
        self.delayNode.connect( self.delayGainNode );

        latestNode.connect(self.delayNode);
        // self.delayNode.connect( audioContext.destination );
        latestNode = self.delayNode;

        wetGain.connect(self.delayNode);
        // self.delayNode.connect(wetGain);

        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal delay_pedal " + this.pedalID ; 
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background delay_background " + this.pedalID ; 
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light delay_light " + this.pedalID ; 
        this.lightDiv.addEventListener('click', this.toggleControls);
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch delay_switch " + this.pedalID ; 
        this.switchDiv.addEventListener('click', this.delayToggle);
 
        this.timeSliderDiv = document.createElement("div"); this.timeSliderDiv.className = "slider delay_time " + this.pedalID ; 
        this.timeKnobDiv = document.createElement("div"); this.timeKnobDiv.className = "knob delay_time " + this.pedalID ; 
        $(this.timeKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayTimeOffset = 335; var delayTimeOffsetSet = 1;}
                if (this.angle>0) { var delayTimeOffset = 25; var delayTimeOffsetSet = 1;}
            // }
            var angle = this.angle + delayTimeOffset;
            var newDelayTime = (angle/360)*100;
            self.setTime(newDelayTime);
            console.log(newDelayTime);
        }});

        this.volumeSliderDiv = document.createElement("div"); this.volumeSliderDiv.className = "slider delay_volume " + this.pedalID ; 
        this.volumeKnobDiv = document.createElement("div"); this.volumeKnobDiv.className = "knob delay_volume " + this.pedalID ; 
        $(this.volumeKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayVolumeOffset = 335; var delayVolumeOffsetSet = 1;}
                if (this.angle>0) { var delayVolumeOffset = 25; var delayVolumeOffsetSet = 1;}
            // }
            var angle = this.angle + delayVolumeOffset;
            var newDelayVolume = (angle/360)*100;
            self.setVolume(newDelayVolume);
            console.log(newDelayVolume);
        }});

        this.feedbackSliderDiv = document.createElement("div"); this.feedbackSliderDiv.className = "slider delay_feedback " + this.pedalID ; 
        this.feedbackKnobDiv = document.createElement("div"); this.feedbackKnobDiv.className = "knob delay_feedback " + this.pedalID ; 
        $(this.feedbackKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
            // if (driveAmountOffsetSet==0)
            // {
                if (this.angle<0) { var delayFeedbackOffset = 335; var delayFeedbackOffsetSet = 1;}
                if (this.angle>0) { var delayFeedbackOffset = 25; var delayFeedbackOffsetSet = 1;}
            // }
            var angle = this.angle + delayFeedbackOffset;
            var newDelayFeedback = (angle/360)*100;
            self.setFeedback(newDelayFeedback);
            console.log(newDelayFeedback);
        }});


        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.timeKnobDiv);
        $(this.containerDiv).append(this.timeSliderDiv);
        $(this.containerDiv).append(this.volumeKnobDiv);
        $(this.containerDiv).append(this.volumeSliderDiv);
        $(this.containerDiv).append(this.feedbackKnobDiv);
        $(this.containerDiv).append(this.feedbackSliderDiv);



        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        $(".slider.delay_time."+this.pedalID).slider({
            slide: function( event, ui ) { 
                self.setTime(ui.value); 
            },
            value: 100,
            orientation: "vertical"
        }); 
        $(".slider.delay_volume."+this.pedalID).slider({
            slide: function( event, ui ) { 
                self.setVolume(ui.value); 
            },
            value: 100,
            orientation: "vertical"
        });
        $(".slider.delay_feedback."+this.pedalID).slider({
            slide: function( event, ui ) { 
                self.setFeedback(ui.value); 
            },
            value: 100,
            orientation: "vertical"
        });


        this.changeControls("knobs");

        this.pedalSetup = true;
    }

    if (this.pedalSetup != true) { this.setUpDelay(); }
    this.delayToggle();
}

// --------- Drive ---------------------------------------------------------------------------

function Drive() {
    var self = this;
    self.setDrive = function(newDriveAmount) {
        if (newDriveAmount==0) { newDriveAmount ++; }
        self.driveAmount = newDriveAmount;
        self.driveNode.setDrive(self.driveAmount);
    }

    self.hideControls = function () {
        self.driveKnobDiv.style.display = 'none';
        self.driveSlideDiv.style.display = 'none';
        // $(".slider.drive_amount").hide();
    }
    self.showKnobs = function () {
        self.driveKnobDiv.style.display = 'block';
    }
    self.showSliders = function () {
        self.driveSlideDiv.style.display = 'block';
    }

    self.changeControls = function (type) {
        switch (type)   
        {
            case "knobs" :
                self.hideControls();
                self.showKnobs();
                self.controlType = type;
                break;  
            case "sliders" :
                self.hideControls();
                self.showSliders();
                self.controlType = type;
                break; 
        }
    }
    self.toggleControls = function() {
        switch (self.controlType)   
        {
            case "knobs" :
                self.changeControls("sliders");
                break;  
            case "sliders" :
                self.changeControls("knobs");                
                break; 
        }
    }


    self.driveToggle = function () {
        if (self.driveActive != true)
        {
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
            self.driveNode.output.disconnect(0);
            self.driveActive = false;
            $(self.lightDiv).hide();
        }

        for (i=0;i<toReset.length;i++)
        {
            toReset[i].restart();
        }
    }
    self.setUpDrive = function() {
        pedalID ++;
        this.pedalID = pedalID;
        this.driveAmount = 1.0;

        self.driveNode = new WaveShaper( audioContext );

        // latestNode.connect(self.driveNode.output);
        // self.driveNode.output.connect(audioContext.destination);
        // latestNode = self.driveNode.output;

        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal drive_pedal " + this.pedalID ; 
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background drive_background " + this.pedalID ; 
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light drive_light " + this.pedalID ; 
        this.lightDiv.addEventListener('click', this.toggleControls);
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch drive_switch " + this.pedalID ;
        this.switchDiv.addEventListener('click', this.driveToggle);
        this.driveKnobDiv = document.createElement("div"); this.driveKnobDiv.className = "knob drive_amount " + this.pedalID ;
        $(this.driveKnobDiv).propeller({inertia: 0, speed: 0, step: 5, onRotate: function() { 
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
        this.driveSlideDiv = document.createElement("div"); this.driveSlideDiv.className = "slider drive_amount " + this.pedalID ; 

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.driveKnobDiv);
        $(this.containerDiv).append(this.driveSlideDiv);
        $(".slider.drive_amount."+this.pedalID).slider({
            slide: function( event, ui ) { 
                self.setDrive(ui.value); 
            },
            value: 100,
            // orientation: "vertical"
        }); 
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });


        this.changeControls("knobs");



        this.pedalSetup = true;
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
        pedalID ++;
        this.pedalID = pedalID;
        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal drive_pedal " + this.pedalID;
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background drive_background " + this.pedalID;
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light drive_light " + this.pedalID;
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch drive_switch " + this.pedalID;
        this.switchDiv.addEventListener('click', this.radioToggle);

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.knobDiv);
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        this.pedalSetup = true;
    }

    if (this.pedalSetup != true) { this.setUpRadio(); }
    this.radioToggle();
}

// --------- Bitcrusher ---------------------------------------------------------------------------

function BitCrusher() {
    var self = this;
    self.bufferSize = 4096

    self.bitCrusherToggle = function () {
        if (self.bitCrusherActive != true)
        {
            // http://noisehack.com/custom-audio-effects-javascript-web-audio-api/
            self.bitCrusherNode = audioContext.createScriptProcessor(self.bufferSize, 1, 1);
            self.bitCrusherNode.bits = 16; // between 1 and 16
            self.bitCrusherNode.normfreq = 0.1; // between 0.0 and 1.0
            var step = Math.pow(1/2, self.bitCrusherNode.bits);
            var phaser = 0;
            var last = 0;
            self.bitCrusherNode.onaudioprocess = function(e) {
                var input = e.inputBuffer.getChannelData(0);
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < self.bufferSize; i++) {
                    phaser += self.bitCrusherNode.normfreq;
                    if (phaser >= 1.0) {
                        phaser -= 1.0;
                        last = step * Math.floor(input[i] / step + 0.5);
                    }
                    output[i] = last;
                }
            };

            latestNode.connect(self.bitCrusherNode);
            self.bitCrusherNode.connect(audioContext.destination);
            latestNode = self.bitCrusherNode;


            self.bitCrusherActive = true;
            audioInput.connect(self.bitCrusherNode);
            $(self.lightDiv).show();
        }
        else 
        {
            self.bitCrusherActive = false;
            self.bitCrusherNode.disconnect(0);
            $(self.lightDiv).hide();
        }

        for (i=0;i<toReset.length;i++)
        {
            toReset[i].restart();
        }
    }
    self.setUpBitCrusher = function() {
        pedalID ++;
        this.pedalID = pedalID;
        // html
        this.containerDiv = document.createElement("div"); this.containerDiv.className = "pedal drive_pedal " + this.pedalID;
        this.backgroundDiv = document.createElement("div"); this.backgroundDiv.className = "background drive_background " + this.pedalID;
        this.lightDiv = document.createElement("div"); this.lightDiv.className = "light drive_light " + this.pedalID;
        this.switchDiv = document.createElement("div"); this.switchDiv.className = "switch drive_switch " + this.pedalID;
        this.switchDiv.addEventListener('click', this.bitCrusherToggle);

        $(".pedal_section").append(this.containerDiv);
        $(this.containerDiv).append(this.backgroundDiv);
        $(this.containerDiv).append(this.lightDiv);
        $(this.containerDiv).append(this.switchDiv);
        $(this.containerDiv).append(this.knobDiv);
        $( ".pedal" ).draggable({ containment: ".bottom_section", scroll: false, cancel: ".knob" });

        this.pedalSetup = true;
    }

    if (this.pedalSetup != true) { this.setUpBitCrusher(); }
    this.bitCrusherToggle();
}

// --------- LOOPER ---------------------------------------------------------------------------
var recorder;
var recording = false;
function recStart() {
    recorder = new Recorder(latestNode);
    recorder.record();
    updateLoopLight("red");
    recording = true;
}
function recStop() {
    recorder.stop();
    recording = false;
    recorder.exportWAV(function(s) {
        document.getElementById('loopPlayer').src = window.URL.createObjectURL(s);
    });
    updateLoopLight("green");
}

function loopStop() {
    document.getElementById('loopPlayer').pause();
}
function loopStart() {
    document.getElementById('loopPlayer').currentTime = 0;     
    document.getElementById('loopPlayer').play();
}

// --------- TAP TEMPO ---------------------------------------------------------------------------
var tapInProgress = false; 
var tapComplete = false;

var thisTapStart; 
var averageTap = 0;
var totalTap = 0;
var tapCount = 0;
var countDownCount = 4;
var recCount = 8;
var recBeats = 8;

function changeBars(bars) {
    recBeats = 4*bars;
    recCount = recBeats;
}

function playClick() {
    document.getElementById('clickPlayer').currentTime = 0;   
    document.getElementById('clickPlayer').play();
}
function recordTap() {
    setTimeout(function() {
        playClick();
        recCount --;
        if (recCount>0)
        {
            recordTap();
        }
        else
        {
            recCount = recBeats;
            setTimeout(recStop, averageTap);
        }
    }, averageTap);   
}
function countDown() {
    setTimeout(function() {
        playClick();
        countDownCount --;        
        updateCountdownText(countDownCount+1);
        if (countDownCount>0)
        {
            countDown();
        }
        else
        {
            countDownCount = 4;
            setTimeout(function() {
                tapComplete = false;
                recStart();
                updateCountdownText(0, true);
            }, averageTap);
            recordTap();
        }
    }, averageTap);
}

function newTap() {
    loopStop();
    updateLoopStartStop("clear");

    playClick();
    tapCount ++;

    if (tapInProgress==false)
    {
        tapInProgress = true;
    }   
    else
    {
        var thisTapEnd = new Date();
        totalTap += (thisTapEnd-thisTapStart);
    } 

    if (tapCount==4) {
        averageTap = totalTap/3;
        updateBPMText(averageTap);
        tapCount = 0;
        totalTap = 0;
        tapComplete = true;
        tapInProgress = false;
        countDown();
    }
    else {
        thisTapStart = new Date();  
    }
}

// --------- KEY EVENTS ---------------------------------------------------------------------------

$(window).keypress(function(e) {
    switch (e.which)   
    {
        case 82 :
            if (recording==false)
            {
                recStart();
            }
            else
            {
                recStop();
            }
            break;
        case 32 :
            newTap();
            break;
    }
});


// --------- MAIN ---------------------------------------------------------------------------

function audioStream(stream) {
    // Create an AudioNode from the stream.
    audioInput = audioContext.createMediaStreamSource( stream );
    // Connect it to the destination to hear yourself (or any other node for processing!)
 
    dryGain = audioContext.createGain();
    dryGain.gain.value = 0.5;
    audioInput.connect(dryGain);
    latestNode = dryGain;
    wetGain = audioContext.createGain();  
    wetGain.gain.value = 0.5;
    audioInput.connect(wetGain);

    dryGain.connect( audioContext.destination );
    // wetGain.connect( audioContext.destination );
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
        case "bitcrusher" :
            new BitCrusher();
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