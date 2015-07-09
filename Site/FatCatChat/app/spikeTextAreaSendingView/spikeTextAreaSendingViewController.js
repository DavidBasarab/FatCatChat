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

    function trace(text) {
        console.log((performance.now() / 1000).toFixed(3) + ": " + text);
    }

    viewModel.onStartClick = function() {
        var servers = null;

        window.localPeerConnection = new RTCPeerConnection(servers, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        trace('Created local peer connection object localPeerConnection');

        try {
            // Reliable Data Channels not yet supported in Chrome
            sendChannel = localPeerConnection.createDataChannel('sendDataChannel', {
                reliable: false
            });

            trace('Created send data channel');
        } catch (e) {
            alert('Failed to create data channel.  You need Chrome M25 or later with RptDataChannel enabled');

            trace('createDataChannel() failed with exception: ' + e.message);
        }

        localPeerConnection.onicecandidate = getLocalCandidate;

        sendChannel.onopen = handleSendChannelStateChange;
        sendChannel.onclose = handleSendChannelStateChange;

        window.remotePeerConnection = new RTCPeerConnection(servers,
            {
                optional: [{
                    RtpDataChannels: true
                }]
            });

        trace('Created remote peer connection object remotePeerConnection');

        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.ondatachannel = gotReceiveChannel;

        localPeerConnection.createOffer(gotLocalDescription, handleError);
    };

    function getLocalCandidate(event) {
        trace('local ice callback');

        if (event.candidate) {
            remotePeerConnection.addIceCandidate(event.candidate);
            trace('Local ICE candidate: \n' + event.candidate.candidate);
        }
    }

    function handleSendChannelStateChange() {
        var readyState = sendChannel.readyState;
        trace('Send channel state is: ' + readyState);
        if (readyState == "open") {
            //dataChannelSend.disabled = false;
            //dataChannelSend.focus();
            //dataChannelSend.placeholder = "";
            //sendButton.disabled = false;
            //closeButton.disabled = false;
        } else {
            //dataChannelSend.disabled = true;
            //sendButton.disabled = true;
            //closeButton.disabled = true;
        }
    }

    function handleReceiveChannelStateChange() {
        var readyState = receiveChannel.readyState;
        trace('Receive channel state is: ' + readyState);
    }

    function gotRemoteIceCandidate(event) {
        trace('remote ice callback');
        if (event.candidate) {
            localPeerConnection.addIceCandidate(event.candidate);
            trace('Remote ICE candidate: \n ' + event.candidate.candidate);
        }
    }

    function gotReceiveChannel(event) {
        trace('Receive Channel Callback');
        receiveChannel = event.channel;
        receiveChannel.onmessage = handleMessage;
        receiveChannel.onopen = handleReceiveChannelStateChange;
        receiveChannel.onclose = handleReceiveChannelStateChange;
    }

    function handleMessage(event) {
        trace('Received message: ' + event.data);
        document.getElementById("dataChannelReceive").value = event.data;
    }

    function gotLocalDescription(desc) {
        localPeerConnection.setLocalDescription(desc);

        trace('Offer from localPeerConnection \n' + desc.sdp);

        remotePeerConnection.setRemoteDescription(desc);
        remotePeerConnection.createAnswer(gotRemoteDescription, handleError);
    }

    function gotRemoteDescription(desc) {
        remotePeerConnection.setLocalDescription(desc);
        trace('Answer from remotePeerConnection \n' + desc.sdp);
        localPeerConnection.setRemoteDescription(desc);
    }

    function handleError() {

    }

    viewModel.onSendClick = function() {
        var data = $('#dataChannelSend').val();

        sendChannel.send(data);

        trace('Sent data: ' + data);
    };

    viewModel.onCloseClick = function() {
        trace('Closing data channels');

        sendChannel.close();

        trace('Closed data channel with label: ' + sendChannel.label);

        receiveChannel.close();

        trace('Closed data channel with label: ' + receiveChannel.label);

        localPeerConnection.close();
        remotePeerConnection.close();

        localPeerConnection = null;
        remotePeerConnection = null;

        trace('Closed peer connections');

        viewModel.startDisabled = false;
        viewModel.sendDisabled = true;
        viewModel.closeDisabled = true;

        ('#dataChannelSend').val('');
        ('#dataChannelReceive').val('');
    };
}