'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeTextAreaSending', [])
    .controller('spikeTSAreaCtrl', [spikeTextAreaSendingController]);

function spikeTextAreaSendingController() {
    var viewModel = this;

    var sendChannel;
    var receiveChannel;

    viewModel.startDisabled = false;
    viewModel.sendDisabled = true;
    viewModel.closeDisabled = true;

    viewModel.onStartClick = function() {
        alert('Start Clicked');
    }
}

