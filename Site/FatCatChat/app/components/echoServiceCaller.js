'use strict';

var commonModule = angular.module('myApp.common', []);

commonModule.value('echoUrl', 'http://localhost/echo/');

commonModule.factory('echoService', ['echoUrl', '$rootScope', echoService]);

var connection = null;
var chatProxy = null;
var broadcastMessageCallbacks = [];
var aNewMessageCallbacks = [];

function echoService(echoUrl) {
    connection = $.hubConnection(echoUrl);
    chatProxy = connection.createHubProxy('chatHub');

    function onBroadCastMessage(name, message) {
        console.log('from echoService (broadcastMessage) name = ' + name + ' | message = ' + message);

        for (var i in broadcastMessageCallbacks) {
            broadcastMessageCallbacks[i](name, message);
        }
    }

    function onOtherMessage(parameter1, parameter2, parameter3) {
        console.log('from echoService (aNewMessage) = ' + parameter1 + ' ' + parameter2 + ' ' + parameter3);

        for (var i in aNewMessageCallbacks) aNewMessageCallbacks[i](parameter1, parameter2, parameter3);
    }

    chatProxy.on('broadcastMessage', onBroadCastMessage);
    chatProxy.on('aNewMessage', onOtherMessage);

    connection.start().done(function() {
        console.log('Started Connection');
    });

    function send(name, message) {
        chatProxy.invoke('send', name, message);
    }

    function nextMessage(parameter1, parameter2, parameter3) {
        chatProxy.invoke('nextMessage', parameter1, parameter2, parameter3);
    }

    function registerForBroadcastMessage(callback) {
        broadcastMessageCallbacks.push(callback);
    }

    function registerForANewMessage(callback) {
        aNewMessageCallbacks.push(callback);
    }

    return {
        send: send,
        nextMessage: nextMessage,
        registerForBroadcastMessage: registerForBroadcastMessage,
        registerForANewMessage: registerForANewMessage
    };
}