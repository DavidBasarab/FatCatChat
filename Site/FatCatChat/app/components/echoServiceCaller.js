'use strict';

var commonModule = angular.module('myApp.common', []);

commonModule.value('echoUrl', 'http://localhost/echo/');

commonModule.factory('echoService', ['echoUrl', '$rootScope', echoService]);

var connection = null;
var chatProxy = null;

function echoService(echoUrl, $rootScope) {
    connection = $.hubConnection(echoUrl);
    chatProxy = connection.createHubProxy('chatHub');

    connection.start().done(function() {
        console.log('Connection Start Complete');
    });

    //chatProxy.on('broadcastMessage', onChatMessage);
    function onOtherMessage(parameter1, parameter2, parameter3) {
        console.log('from echoService = ' + parameter1 + ' ' + parameter2 + ' ' + parameter3);
    }

    chatProxy.on('aNewMessage', onOtherMessage);

    function registerForEvent(eventName, callback) {
        chatProxy.on(eventName, function(result) {
            $rootScope.$apply(function() {
                if (callback) {
                    callback(result);
                }
            });
        });
    }

    function send(name, message) {
        chatProxy.invoke('send', name, message);
    }

    function nextMessage(parameter1, parameter2, parameter3) {
        chatProxy.invoke('nextMessage', parameter1, parameter2, parameter3);
    }

    return {
        registerForEvent: registerForEvent,
        send: send,
        nextMessage: nextMessage
    };
}