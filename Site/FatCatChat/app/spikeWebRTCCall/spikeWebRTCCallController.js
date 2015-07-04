'use strict';

angular.module('myApp.spikeWebRTCCall', [])
    .controller('spikeWebRTCCallController', [spikeWebRTCCallController]);

function spikeWebRTCCallController() {
    var viewModel = this;

    var peerConnection;
    var localStream;

    viewModel.TestHello = 'Hello';

    viewModel.onCallClick = function() {
        writeMessage('Call Clicked');

        var audio = $('#changeMe');

        var servers = null;


        var pcConstraints = {
            'optional': []
        };

        peerConnection = new RTCPeerConnection(servers, pcConstraints);

        writeMessage('Create peerConnection');

        peerConnection.onicecandidate = iceCallback;

        writeMessage("Requesting local stream");

        getUserMedia({
            audio: true,
            video: false
        }, gotStream, function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
    };

    function writeMessage(message) {
        var logDiv = $('#loggingData');

        var paragraph = $('<p></p>');

        paragraph.html(message);

        logDiv.append(paragraph);
    }

    function iceCallback(event) {
        if(event.candidate){

        }
    }

    function gotStream(stream) {
        writeMessage('Received stream');
        localStream = stream;

        var audioTracks = localStream.getAudioTracks();

        if(audioTracks.length > 0) {
            writeMessage('Using Audio device: ' audioTracks[0].label)
        }
    }
}

