'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeRemoteCall', [])
    .controller('spikeRemoteCallController', ['echoService', spikeRemoteCallController]);

function spikeRemoteCallController() {
    var viewModel = this;




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
}