'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeRemoteCall', [])
    .controller('spikeRemoteCallController', ['echoService', spikeRemoteCallController]);

function spikeRemoteCallController() {
    var viewModel = this;

    viewModel.hookUpName = 'HOOK UP';
}