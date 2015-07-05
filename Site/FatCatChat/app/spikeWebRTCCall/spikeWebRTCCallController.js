'use strict';

angular.module('myApp.spikeWebRTCCall', [])
    .controller('spikeWebRTCCallController', [spikeWebRTCCallController]);

function spikeWebRTCCallController() {
    var viewModel = this;

    var peerConnection;
    var localStream;

    viewModel.onCallClick = function() {
    };

}

