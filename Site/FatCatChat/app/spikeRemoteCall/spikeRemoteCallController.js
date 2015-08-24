'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeRemoteCall', [])
    .controller('spikeRemoteCallController', ['echoService', spikeRemoteCallController]);

function spikeRemoteCallController() {
    var viewModel = this;

    var videoUrl = 'http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4';

    viewModel.localCamStream = null;
    viewModel.localConnection = null;
    viewModel.remoteConnection = null;

    function onGotLocalStream(stream) {
        writeMessage('Got Local Stream');

        viewModel.localCamStream = stream;

        createVideoPlayer({
            containerId: 'localVideoContainer',
            videoSource: URL.createObjectURL(stream),
            videoPlayerId: 'localStream',
            videoPlayerClass: 'testVideoSize',
            autoPlay: true
        });
    }

    viewModel.startClick = function() {

        writeMessage('Going to get Local User Media');

        getUserMedia({
            audio: false,
            video: true
        }, onGotLocalStream, function(error) {
            writeMessage('getUserMedia error: ', error);
        });
    };

    // https://www.webrtc-experiment.com/docs/WebRTC-PeerConnection.html

    viewModel.makeCallClick = function() {

        writeMessage('Going to start making a remote call');

        writeMessage('Creating local connection');
        viewModel.localConnection = new RTCPeerConnection();

        writeMessage('Creating remote Connection');
        viewModel.remoteConnection = new RTCPeerConnection();

        viewModel.localConnection.onicecandidate = gotLocalConnectionIceCandidate;

        viewModel.localConnection.onaddstream = function(evt) {
            // A stream has arrived, so we are going to create new video with it
            writeMessage('A stream has been added to the local stream');
        };

        viewModel.localConnection.addStream(viewModel.localCamStream);

        viewModel.remoteConnection.onicecandidate = gotRemoteConnectionIceCandidate;
        viewModel.remoteConnection.onaddstream = gotRemoteStream;

        viewModel.localConnection.createOffer(gotLocalDescription, handleError);
    };

    function gotLocalDescription(description) {
        viewModel.localConnection.setLocalDescription(description);

        //writeMessage('Offer from LocalConnection description.sdp = ' + JSON.stringify(description.toJSON()));

        sendThisRequestToTheRemote(description.toJSON());
    }

    function sendThisRequestToTheRemote(jsonDescription) {
        writeMessage('Will send a message to the remote');

        var description = new RTCSessionDescription(jsonDescription);

        // This would happen after a sever call of the sdp which is a RTCSessionDescription
        viewModel.remoteConnection.setRemoteDescription(description);
        viewModel.remoteConnection.createAnswer(gotRemoteDescription, handleError);
    }

    function gotRemoteDescription(description) {
        //writeMessage('on gotRemoteDescription description = ' + description);
        //writeMessage('on gotRemoteDescription description.sdp = ' + JSON.stringify(description.toJSON()));

        viewModel.remoteConnection.setLocalDescription(description);

        sendRequestToOtherPerson(description.toJSON());
    }

    function sendRequestToOtherPerson(jsonDescription) {

        writeMessage('Will send a message to the local');

        var description = new RTCSessionDescription(jsonDescription);

        writeMessage('Setting the description on the localConnection');

        // This would be sent back to the caller via a network request
        viewModel.localConnection.setRemoteDescription(description);
    }

    function handleError(error) {
        writeMessage('Error: ' + error);
    }

    function gotRemoteConnectionIceCandidate(evt) {
        if(evt.candidate) {
            writeMessage('gotRemoteConnectionIceCandidateIce Candidate: ' + JSON.stringify(evt.candidate.toJSON()));
            viewModel.localConnection.addIceCandidate(new RTCIceCandidate(evt.candidate));
        }
    }

    function gotRemoteStream(evt) {
        writeMessage('Got Local Stream');

        createVideoPlayer({
            containerId: 'remoteVideoContainer',
            videoSource: URL.createObjectURL(evt.stream),
            videoPlayerId: 'remotePlayer',
            videoPlayerClass: 'testVideoSize',
            autoPlay: true
        });
    }

    function gotLocalConnectionIceCandidate(evt) {
        if(evt.candidate) {
            writeMessage('gotLocalConnectionIceCandidate On Ice Candidate: ' + JSON.stringify(evt.candidate.toJSON()));
            // This is when somebody else, so lets give it to remove connection
            viewModel.remoteConnection.addIceCandidate(new RTCIceCandidate(evt.candidate));
        }
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

    function writeMessage(message) {
        var paragraph = $('<div></div>');

        paragraph.html((performance.now() / 1000).toFixed(3) + ": " + message);

        var loggingDiv = $('#loggingData');

        loggingDiv.append(paragraph);
    }
}