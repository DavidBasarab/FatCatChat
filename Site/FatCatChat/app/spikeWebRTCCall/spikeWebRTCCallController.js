'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeWebRTCCall', [])
    .controller('spikeWebRTCCallController', [spikeWebRTCCallController]);

function spikeWebRTCCallController() {
    var viewModel = this;

    var localStream;
    var localPeerConnection;
    var remotePeerConnection;

    var localVideo = $('#localVideoPlayer');
    var remoteVideo = $('#remoteVideoPlayer');

    viewModel.startButtonDisabled = false;
    viewModel.callButtonDisabled = true;
    viewModel.hangUpButtonDisabled = true;

    function trace(text) {
        writeMessage(text);
    }

    function gotStream(stream) {
        trace("Received local stream");

        localVideo.src = URL.createObjectURL(stream);
        localStream = stream;

        viewModel.callButtonDisabled = false;
    }

    viewModel.startClick = function() {
        trace('Requesting local stream');

        viewModel.startButtonDisabled = true;

        getUserMedia({
            audio: true,
            video: true
        }, gotStream, function(error) {
            trace("getUserMedia error: ", error);
        });
    };

    viewModel.callClick = function() {
        viewModel.callButtonDisabled = true;
        viewModel.hangUpButtonDisabled = false;

        trace('Starting call');

        if (localStream.getVideoTracks().length > 0) {
            trace('Using video device: ' + localStream.getVideoTracks()[0].label);
        }

        if (localStream.getAudioTracks().length > 0) {
            trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
        }

        var servers = null;

        localPeerConnection = new RTCPeerConnection(servers);
        trace('Created local peer connection object localPeerConnection');
        localPeerConnection.onicecandidate = gotLocalIceCandidate;

        remotePeerConnection = new RTCPeerConnection(servers);
        trace('Created remote peer connection object remotePeerConnection');
        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.onaddstream = gotRemoteStream;

        localPeerConnection.addStream(localStream);
        trace('Added localstream to localPeerConnection');
        localPeerConnection.createOffer(gotLocalDescription, handleError);
    };

    function gotLocalDescription(description) {
        localPeerConnection.setLocalDescription(description);
        trace('Offer from localPeerConnection: \n' + description.spd);

        remotePeerConnection.setRemoteDescription(description);
        remotePeerConnection.createAnswer(gotRemoteDescription, handleError);
    }

    function gotRemoteDescription(description) {
        remotePeerConnection.setLocalDescription(description);
        trace('Answer from remotePeerConnection: \n' + description.spd);
        localPeerConnection.setRemoteDescription(description);
    }

    viewModel.hangUpClick = function() {
        trace('Ending Call');

        localPeerConnection.close();
        remotePeerConnection.close();

        localPeerConnection = null;
        remotePeerConnection = null;

        viewModel.hangUpButtonDisabled = true;
        viewModel.callButtonDisabled = false;
    };

    function gotRemoteStream(event) {
        remoteVideo.src = URL.createObjectURL(event.stream);
        trace('Received remote stream');
    }

    function gotLocalIceCandidate(event) {
        if (event.candidate) {
            remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            trace("Local ICE candidate: \n" + event.candidate.candidate);
        }
    }

    function gotRemoteIceCandidate(event) {
        if (event.candidate) {
            localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            trace("Remote ICE candidate: \n " + event.candidate.candidate);
        }
    }


    function handleError() {
    }

    function writeMessage(message) {
        var paragraph = $('<p></p>');

        paragraph.html((performance.now() / 1000).toFixed(3) + ": " + message);

        var loggingDiv = $('#loggingData');

        loggingDiv.append(paragraph);
    }

}

