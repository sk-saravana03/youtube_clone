import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { RiPhoneFill, RiVideoOnFill, RiVideoOffFill, RiChat4Fill, RiChatOffFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { useReactMediaRecorder } from "react-media-recorder";
import "react-toastify/dist/ReactToastify.css";

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [yourID, setYourID] = useState("");
  const [friendID, setFriendID] = useState("");
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [dots, setDots] = useState("");
  const userVideo = useRef();
  const partnerVideo = useRef();
  const screenStream = useRef();
  const mediaRecorder = useRef();
  const peerRef = useRef();
  const socket = useRef();
  const { startRecording, stopRecording, mediaBlobUrl, status, previewStream } =
    useReactMediaRecorder({
      screen: true,
      audio: true,
      blobPropertyBag: { type: "video/webm" },
    });

  useEffect(() => {
    socket.current = io.connect("http://localhost:5500/");
    console.log("Use Effect running");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.current.on("callEnded", () => {
      endCall();
    });
  }, []);

  const callPeer = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.on("close", () => {
      endCall();
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setInCall(true);
      peer.signal(signal);
    });

    peerRef.current = peer;
  };

  const acceptCall = () => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.on("close", () => {
      endCall();
    });

    peer.signal(callerSignal);
    setCallAccepted(true);
    setInCall(true);
    peerRef.current = peer;
  };

  const startScreenSharing = async () => {
    try {
      screenStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenSharing(true);
      replaceTrack(screenStream.current.getVideoTracks()[0]);
      if (userVideo.current) {
        userVideo.current.srcObject = screenStream.current;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenSharing = () => {
    screenStream.current.getTracks().forEach((track) => track.stop());
    setScreenSharing(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((newStream) => {
        setStream(newStream);
        replaceTrack(newStream.getVideoTracks()[0]);
        if (userVideo.current) {
          userVideo.current.srcObject = newStream;
        }
      });
  };

  const replaceTrack = (newTrack) => {
    const peer = peerRef.current;
    const sender = peer.streams[0].getVideoTracks()[0];
    peer.replaceTrack(sender, newTrack, peer.streams[0]);
  };

  const handleStartRecording = () => {
    setRecording(true);
    toast.info("Recording started");
    startRecording();
  };

  const handleStopRecording = () => {
    setRecording(false);
    toast.info("Recording stopped");
    stopRecording();
  };

  const checkTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    return currentHour >= 18 && currentHour < 24; // 6 PM to 12 AM
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setCallAccepted(false);
    setInCall(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
    if (partnerVideo.current) {
      partnerVideo.current.srcObject = null;
    }
    socket.current.emit("endCall", { to: caller || friendID });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const vibrateStyle = `
    @keyframes vibrate {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
  `;

  const buttonStyle = {
    backgroundColor: "green",
    color: "white",
    width: "40px",
    height: "40px",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
  };

  const grayBtnStyle = {
    color: "white",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    margin: "0 10px",
  };

  const iconStyle = {
    fill: "lightgray",
    width: "24px",
    height: "24px",
  };

  const grayIconStyle = {
    fill: "darkgray",
    width: "24px",
    height: "24px",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
    justifyContent: "center",
  };

  const callingContainer = {
    alignItems: "center",
    justifyContent: "center",
  };

  const inputStyle = {
    width: "360px",
    padding: "10px",
    height: "40px",
    boxSizing: "border-box",
  };

  const acceptCallBtn = {
    backgroundColor: "green",
    color: "white",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    marginLeft: "50%",
    animation: "vibrate 0.5s infinite",
  };

  const endCallStyle = {
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    marginLeft: "20px",
  };

  return (
    <div>
      <style>{vibrateStyle}</style>
      <ToastContainer />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          {callAccepted && inCall ? (
            <div style={containerStyle}>
              <video ref={userVideo} autoPlay muted />
              <video ref={partnerVideo} autoPlay />
            </div>
          ) : (
            <p>Not in call</p>
          )}
        </div>

        <div style={callingContainer}>
          {receivingCall && !callAccepted ? (
            <div>
              <button style={acceptCallBtn} onClick={acceptCall}>
                <RiPhoneFill style={iconStyle} />
              </button>
              <p>Calling...</p>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter friend ID"
                value={friendID}
                style={inputStyle}
                onChange={(e) => setFriendID(e.target.value)}
              />
              <button
                style={{ ...grayBtnStyle, backgroundColor: checkTime() ? "green" : "gray" }}
                onClick={() => checkTime() && callPeer(friendID)}
                disabled={!checkTime()}
              >
                <RiPhoneFill style={grayIconStyle} />
              </button>
              <button style={grayBtnStyle} onClick={endCall}>
                <RiPhoneFill style={{ ...grayIconStyle, fill: "red" }} />
              </button>
            </div>
          )}
        </div>

        {callAccepted && inCall && (
          <div style={containerStyle}>
            {!screenSharing ? (
              <button style={grayBtnStyle} onClick={startScreenSharing}>
                <RiVideoOnFill style={grayIconStyle} />
              </button>
            ) : (
              <button style={grayBtnStyle} onClick={stopScreenSharing}>
                <RiVideoOffFill style={grayIconStyle} />
              </button>
            )}

            {!recording ? (
              <button style={grayBtnStyle} onClick={handleStartRecording}>
                <RiChat4Fill style={grayIconStyle} />
              </button>
            ) : (
              <button style={grayBtnStyle} onClick={handleStopRecording}>
                <RiChatOffFill style={grayIconStyle} />
              </button>
            )}
          </div>
        )}
      </div>

      {mediaBlobUrl && (
        <div>
          <a href={mediaBlobUrl} download="recorded-session.webm">
            Download Recorded Session
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
