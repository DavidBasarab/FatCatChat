'use strict';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

angular.module('myApp.spikeSignalR', [])
    .controller('spikeSignalRController', [spikeSignalRController]);

function spikeSignalRController() {
    var viewModel = this;

    var connection = null;
    var chatProxy = null;

    viewModel.onStartClick = function() {
        connection = $.hubConnection('http://localhost:59026/');
        chatProxy = connection.createHubProxy('chatHub');
        chatProxy.on('broadcastMessage', onChatMessage);

        connection.start().done(function() {
            chatProxy.invoke('send', 'FromTheScript', 'This is a test message');
        });
    };

    function onChatMessage(name, message) {
        console.log(name + ' ' + message);
    }


}