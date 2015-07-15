'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeSignalR', [])
    .controller('spikeSignalRController', ['echoService', spikeSignalRController]);

function spikeSignalRController(echoService) {
    var viewModel = this;


    viewModel.onStartClick = function() {

        echoService.registerForEvent('broadcastMessage', onChatMessage);
        echoService.registerForEvent('aNewMessage', onOtherMessage);

        setTimeout(function() {
            echoService.nextMessage('FromTheScript', 'This is another message', 'I am tired and want to sleep');
        }, 100);

        //echoService.send('FromTheScript', 'This is a test message');
    };

    function onChatMessage(name, message) {
        console.log(name + ' ' + message);
    }

    function onOtherMessage(parameter1, parameter2, parameter3) {
        console.log('In SpikeSignalR = ' + parameter1 + ' ' + parameter2 + ' ' + parameter3);
    }
}