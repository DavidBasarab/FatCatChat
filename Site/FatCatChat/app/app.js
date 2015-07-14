'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.common',
    'myApp.view1',
    'myApp.view2',
    'myApp.spikeWebRTCCall',
    'myApp.spikeTextAreaSending',
    'myApp.spikeSignalR',
    'myApp.version'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
