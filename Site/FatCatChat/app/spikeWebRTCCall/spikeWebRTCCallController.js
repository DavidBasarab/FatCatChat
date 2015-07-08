'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeWebRTCCall', [])
    .controller('spikeWebRTCCallController', [spikeWebRTCCallController]);

function spikeWebRTCCallController() {
    var viewModel = this;

    viewModel.localStream = null;
    viewModel.localPeerConnection = null;
    viewModel.remotePeerConnection = null;

    viewModel.localSource = '';

    viewModel.startButtonDisabled = false;
    viewModel.callButtonDisabled = true;
    viewModel.hangUpButtonDisabled = true;

    function trace(text) {
        writeMessage(text);
    }

    function createVideoPlayer(options) {
        var videoContainer = $('#' + options.containerId);

        var videoElement = $('<video></video>');

        videoElement.attr('src', options.videoSource);
        videoElement.attr('id', options.videoPlayerId);
        videoElement.addClass(options.videoPlayerClass);

        videoContainer.append(videoElement);

        if (options.autoPlay) {
            window.setTimeout(function() {
                $('#' + options.videoPlayerId).get(0).play();
            }, 10);
        }
    }

    function gotStream(stream) {
        trace("Received local stream");

        var createPlayerOptions = {
            containerId: 'localVideoContainer',
            videoSource: URL.createObjectURL(stream),
            videoPlayerId: 'localPlayer',
            videoPlayerClass: 'testVideoSize',
            autoPlay: true
        };

        createVideoPlayer(createPlayerOptions);

        viewModel.localStream = stream;
    }

    viewModel.startClick = function() {
        trace('Requesting local stream');

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

        if (viewModel.localStream.getVideoTracks().length > 0) {
            trace('Using video device: ' + viewModel.localStream.getVideoTracks()[0].label);
        }

        if (viewModel.localStream.getAudioTracks().length > 0) {
            trace('Using audio device: ' + viewModel.localStream.getAudioTracks()[0].label);
        }

        var servers = null;

        viewModel.localPeerConnection = new RTCPeerConnection(servers);
        trace('Created local peer connection object localPeerConnection');
        viewModel.localPeerConnection.onicecandidate = gotLocalIceCandidate;

        viewModel.remotePeerConnection = new RTCPeerConnection(servers);
        trace('Created remote peer connection object remotePeerConnection');
        viewModel.remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        viewModel.remotePeerConnection.onaddstream = gotRemoteStream;

        viewModel.localPeerConnection.addStream(viewModel.localStream);
        trace('Added localstream to localPeerConnection');
        viewModel.localPeerConnection.createOffer(gotLocalDescription, handleError);
    };

    function gotLocalDescription(description) {
        viewModel.localPeerConnection.setLocalDescription(description);
        trace('Offer from localPeerConnection: \n' + description.spd);

        viewModel.remotePeerConnection.setRemoteDescription(description);
        viewModel.remotePeerConnection.createAnswer(gotRemoteDescription, handleError);
    }

    function gotRemoteDescription(description) {
        viewModel.remotePeerConnection.setLocalDescription(description);
        trace('Answer from remotePeerConnection: \n' + description.spd);
        viewModel.localPeerConnection.setRemoteDescription(description);
    }

    viewModel.hangUpClick = function() {
        trace('Ending Call');

        viewModel.localPeerConnection.close();
        viewModel.remotePeerConnection.close();

        viewModel.localPeerConnection = null;
        viewModel.remotePeerConnection = null;

        viewModel.hangUpButtonDisabled = true;
        viewModel.callButtonDisabled = false;
    };

    function gotRemoteStream(event) {
        trace('Received remote stream');

        var createPlayerOptions = {
            containerId: 'remoteVideoContainer',
            videoSource: URL.createObjectURL(event.stream),
            videoPlayerId: 'remotePlayer',
            videoPlayerClass: 'testVideoSize',
            autoPlay: true
        };

        createVideoPlayer(createPlayerOptions);
    }

    function gotLocalIceCandidate(event) {
        if (event.candidate) {
            viewModel.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            trace("Local ICE candidate: \n" + event.candidate.candidate);
        }
    }

    function gotRemoteIceCandidate(event) {
        if (event.candidate) {
            viewModel.localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
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

