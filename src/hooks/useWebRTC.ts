// import { useEffect, useRef, useState } from 'react';
// import { WebRTCConnection } from '../lib/webrtc';
// import { socket } from '../lib/socket';
// import { useAuthStore } from '../lib/store';

// export function useWebRTC(meetingId: string) {
//   const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
//   const connectionsRef = useRef<Map<string, WebRTCConnection>>(new Map());
//   const user = useAuthStore(state => state.user);

//   useEffect(() => {
//     if (!user) return;

//     const handleUserJoined = async (data: { user: string }) => {
//       if (data.user === user.email) return;

//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });

//       const connection = new WebRTCConnection(localStream, (stream) => {
//         setRemoteStreams(prev => [...prev, stream]);
//       });

//       connectionsRef.current.set(data.user, connection);

//       const offer = await connection.createOffer();
//       socket.emit('signal', {
//         meeting_id: meetingId,
//         sender: user.email,
//         receiver: data.user,
//         signal: { type: 'offer', offer }
//       });
//     };

//     const handleSignal = async (data: {
//       sender: string;
//       signal: any;
//     }) => {
//       if (data.sender === user.email) return;

//       let connection = connectionsRef.current.get(data.sender);

//       if (!connection) {
//         const localStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true
//         });

//         connection = new WebRTCConnection(localStream, (stream) => {
//           setRemoteStreams(prev => [...prev, stream]);
//         });
//         connectionsRef.current.set(data.sender, connection);
//       }

//       if (data.signal.type === 'offer') {
//         const answer = await connection.handleOffer(data.signal.offer);
//         socket.emit('signal', {
//           meeting_id: meetingId,
//           sender: user.email,
//           receiver: data.sender,
//           signal: { type: 'answer', answer }
//         });
//       } else if (data.signal.type === 'answer') {
//         await connection.handleAnswer(data.signal.answer);
//       } else if (data.signal.type === 'candidate') {
//         await connection.addIceCandidate(data.signal.candidate);
//       }
//     };

//     socket.on('user_joined', handleUserJoined);
//     socket.on('signal', handleSignal);

//     socket.emit('join', { meeting_id: meetingId, user: user.email });

//     return () => {
//       socket.off('user_joined', handleUserJoined);
//       socket.off('signal', handleSignal);
//       connectionsRef.current.forEach(connection => connection.close());
//       connectionsRef.current.clear();
//     };
//   }, [meetingId, user]);

//   return { remoteStreams };
// }

import { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';
import { useAuthStore } from '../lib/store';

export function useWebRTC(meetingId: string) {
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const connectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const handleUserJoined = async (data: { user: string }) => {
      if (data.user === user.email) return;

      const peerConnection = createPeerConnection(data.user);
      connectionsRef.current.set(data.user, peerConnection);

      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit('signal', { meeting_id: meetingId, sender: user.email, signal: offer });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    const handleSignal = async (data: { sender: string, signal: any }) => {
      let peerConnection = connectionsRef.current.get(data.sender);
      if (!peerConnection) {
        peerConnection = createPeerConnection(data.sender);
        connectionsRef.current.set(data.sender, peerConnection);
      }

      if (data.signal.type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('signal', { meeting_id: meetingId, sender: user.email, signal: answer });
      } else if (data.signal.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
      } else if (data.signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
      }
    };

    const createPeerConnection = (peerId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('signal', { meeting_id: meetingId, sender: user.email, signal: event.candidate });
        }
      };

      peerConnection.ontrack = (event) => {
        setRemoteStreams(prevStreams => new Map(prevStreams).set(peerId, event.streams[0]));
      };

      return peerConnection;
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('signal', handleSignal);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('signal', handleSignal);
    };
  }, [meetingId, user]);

  return { remoteStreams };
}