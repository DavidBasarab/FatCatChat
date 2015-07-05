'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeWebRTCCall', [])
    .controller('spikeWebRTCCallController', [spikeWebRTCCallController]);

function spikeWebRTCCallController() {
    var viewModel = this;

    var peerConnection;
    var localStream;

    var constraints = {
        video: true
    };

    function successCallback(stream) {

        writeMessage("On Success Callback")

        localStream = stream;     // stream available to console

        var video = document.querySelector("video");

        video.src = window.URL.createObjectURL(localStream);

        setTimeout(function() { // For some reason play must be on seperate thread or delayed otherwise get 1 picture.
            video.play();
        }, 10);
    }

    function errrorCallback(error) {
        writeMessage("getUserMedia error: " + error);
    }

    viewModel.onCallClick = function() {
        writeMessage('On Call Click');

        getUserMedia(constraints, successCallback, errrorCallback);
    };

    function writeMessage(message) {
        var paragraph = $('<p></p>');

        paragraph.html(message);

        var loggingDiv = $('#loggingData');

        loggingDiv.append(paragraph);
    }

}

