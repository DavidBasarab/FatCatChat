'use strict';

var commonModule = angular.module('myApp.common', []);

commonModule.value('echoUrl', 'http://localhost/echo/');

commonModule.factory('echoService', ['echoUrl', '$rootScope', echoService]);

var connection = null;
var chatProxy = null;

function echoService(echoUrl, $rootScope) {
    connection = $.hubConnection(echoUrl);
    chatProxy = connection.createHubProxy('chatHub');
    var started = false;

    //chatProxy.on('broadcastMessage', onChatMessage);
    function onOtherMessage(parameter1, parameter2, parameter3) {
        console.log('from echoService = ' + parameter1 + ' ' + parameter2 + ' ' + parameter3);
    }

    function registerForEvent(eventName, callback) {
        chatProxy.on(eventName, function(result) {
            $rootScope.$apply(function() {
                if (callback) {
                    callback(result);
                }
            });
        });

        if (!started) {
            connection.start().done(function() {
                console.log('Started Connection');
                started = true;
            });
        }
    }

    function send(name, message) {
        setTimeout(function() {
            chatProxy.invoke('send', name, message);
        }, 1);
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