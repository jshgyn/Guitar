window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var currentEffectNode = null;
var audioInput = null;
var wetGain = null;
var outputMix = null;

var delayActive = false;
var delayNode = null;
var delayGainNode = null;
var delayController = null;
var delayTime = 0.1;
var delayFeedback = 0.1;

function createDelay() {
    delayNode = audioContext.createDelay();
    delayNode.delayTime.value = delayTime;
    // dtime = delayNode;

    delayGainNode = audioContext.createGain();
    delayGainNode.gain.value = delayFeedback;
    // dregen = delayGainNode;

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
                delayNode.delayTime.value = (val+35)/360;
                break;
            case "v":

                break;
            case "f":
                delayGainNode.gain.value = (val+35)/360;
                if (delayGainNode.gain.value > 1) { delayGainNode.gain.value = 1; }
                break;
        }
    }
    // removeEffect("delay");
    // addEffect("delay"); 
}


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
            break;
    }
}

function removeEffect(type) {
    switch (type)
    {
        case "delay":
            delayController.disconnect(0);
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