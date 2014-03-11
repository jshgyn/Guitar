window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var currentEffectNode = null;
var audioInput = null;
var wetGain = null;
var outputMix = null;

var wetGainVal = 0;

// --------- Delay ---------------------------------------------------------------------------

var delayActive = false;
var delayController = null;

var delayNode = null;
var delayGainNode = null;

var delayTime = 0.1;
var delayFeedback = 0.1;

function createDelay() {
    delayNode = audioContext.createDelay();
    delayNode.delayTime.value = delayTime;

    delayGainNode = audioContext.createGain();
    delayGainNode.gain.value = delayFeedback;

    delayGainNode.connect( delayNode );
    delayNode.connect( delayGainNode );
    delayNode.connect( wetGain );

    delayActive = true;
    return delayNode;
}

function updateDelay(x, val) {
    if (delayActive)
    {
        switch (x)
        {
            case "t":
                delayTime = val/360;
                delayNode.delayTime.value = delayTime;
                break;
            case "v":
                wetGainVal = val/360;
                wetGain.gain.value = wetGainVal;
                if (wetGain.gain.value > 1) { wetGain.gain.value = 1; }
                break;
            case "f":
                delayFeedback = val/360;
                delayGainNode.gain.value = delayFeedback;
                if (delayGainNode.gain.value > 1) { delayGainNode.gain.value = 1; }
                break;
        }
    }
    // removeEffect("delay");
    // addEffect("delay"); 
}

function restartDelay() {
    if (delayActive) { 
        removeEffect("delay");
        addEffect("delay");
    }
}


// --------- Drive ---------------------------------------------------------------------------

var driveActive = false;
var driveController = null;
var driveNode = null;
var driveAmount = 1.0;
function createDrive() {
    driveNode = new WaveShaper( audioContext );
    driveNode.output.connect ( wetGain )
    driveNode.output.connect ( outputMix )
    driveNode.setDrive(driveAmount);

    driveActive = true;
    return driveNode.input;

}

function updateDrive(x, val) {
    if (driveActive)
    {
        switch (x)
        {
            case "d":
                driveAmount = (val/360)*50;
                driveNode.setDrive(driveAmount);
                restartDelay();
                break;
        }
    }
}

function restartDrive() {
    if (driveActive) { 
        removeEffect("drive");
        addEffect("drive");
    }
}

// --------- MAIN ---------------------------------------------------------------------------

function audioStream(stream) {
    // Create an AudioNode from the stream.
    audioInput = audioContext.createMediaStreamSource( stream );
    // Connect it to the destination to hear yourself (or any other node for processing!)
 
    outputMix = audioContext.createGain();
    wetGain = audioContext.createGain();  
    audioInput.connect(outputMix);
    wetGain.connect(outputMix);

    outputMix.connect( audioContext.destination );
}

function addEffect(type) {
    switch (type)
    {
        case "delay":
            delayController = createDelay();
            audioInput.connect( delayController );
            if (driveActive) { delayController.connect( driveController ) }
            break;
        case "drive":
            driveController = createDrive();
            audioInput.connect( driveController );
            // wetGain.connect( driveController );
            // outputMix.connect( driveController );
            if (delayActive) { driveController.connect( delayController ); restartDelay(); }
   }
}

function removeEffect(type) {
    switch (type)
    {
        case "delay":
            delayController.disconnect(0);
            delayController = null;
            delayNode = null;
            delayGainNode = null;
            delayActive = false;
            break;
        case "drive":
            driveController.disconnect(0);
            driveController = null;
            driveNode = null;
            driveActive = false;
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