// http://stackoverflow.com/questions/20067739/what-is-stun-stun-l-google-com19302-used-for
//pcConfig = {"iceServers": [{'url': 'stun:stun.l.google.com:19302'}]},


var signalingChannel = createSignalingChannel();
var pc;
var configuration = {"iceServers": [{'url': 'stun:stun.l.google.com:19302'}]};

// run start(true) to initiate a call
function start(isCaller) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function(evt) {
        //  Basically what this is is when you get other users this will let them know they exist
        signalingChannel.send(JSON.stringify({"candidate": evt.candidate}));
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function(evt) {
        remoteView.src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({"audio": true, "video": true}, function(stream) {

        // This is the stream from the local browser
        selfView.src = URL.createObjectURL(stream);

        pc.addStream(stream);

        if (isCaller)
            pc.createOffer(gotDescription);
        else
            pc.createAnswer(pc.remoteDescription, gotDescription);

        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            signalingChannel.send(JSON.stringify({"sdp": desc}));
        }
    });
}

signalingChannel.onmessage = function(evt) {
    if (!pc)
        start(false);

    var signal = JSON.parse(evt.data);
    if (signal.sdp)
        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    else
        pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
};