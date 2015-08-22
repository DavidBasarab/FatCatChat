'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeRemoteCall', [])
    .controller('spikeRemoteCallController', ['echoService', spikeRemoteCallController]);

function spikeRemoteCallController() {
    var viewModel = this;

    var videoUrl = 'http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4';

    viewModel.startClick = function()  {

        var localConnection = new RTCPeerConnection();
        var remoteConnection = new RTCPeerConnection();

        localConnection.onicecandidate = function(evt) {
            // This is when somebody else, so lets give it to remove connection
            remoteConnection.addIceCandidate(new RTCIceCandidate(evt.candidate));
        };

        localConnection.onaddstream = function(evt) {
            // A stream has arrived, so we are going to create new video with it
        }
    };



    function createVideoPlayer(options) {

        var videoContainer = $('#' + options.containerId);

        var nameDiv =

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