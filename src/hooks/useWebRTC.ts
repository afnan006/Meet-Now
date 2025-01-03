import { useEffect, useRef, useState } from 'react';
import { WebRTCConnection } from '../lib/webrtc';
import { socket } from '../lib/socket';
import { useAuthStore } from '../lib/store';

export function useWebRTC(meetingId: string) {
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const connectionsRef = useRef<Map<string, WebRTCConnection>>(new Map());
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const handleUserJoined = async (data: { user: string }) => {
      if (data.user === user.email) return;

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const connection = new WebRTCConnection(localStream, (stream) => {
        setRemoteStreams(prev => [...prev, stream]);
      });

      connectionsRef.current.set(data.user, connection);

      const offer = await connection.createOffer();
      socket.emit('signal', {
        meeting_id: meetingId,
        sender: user.email,
        receiver: data.user,
        signal: { type: 'offer', offer }
      });
    };

    const handleSignal = async (data: {
      sender: string;
      signal: any;
    }) => {
      if (data.sender === user.email) return;

      let connection = connectionsRef.current.get(data.sender);

      if (!connection) {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        connection = new WebRTCConnection(localStream, (stream) => {
          setRemoteStreams(prev => [...prev, stream]);
        });
        connectionsRef.current.set(data.sender, connection);
      }

      if (data.signal.type === 'offer') {
        const answer = await connection.handleOffer(data.signal.offer);
        socket.emit('signal', {
          meeting_id: meetingId,
          sender: user.email,
          receiver: data.sender,
          signal: { type: 'answer', answer }
        });
      } else if (data.signal.type === 'answer') {
        await connection.handleAnswer(data.signal.answer);
      } else if (data.signal.type === 'candidate') {
        await connection.addIceCandidate(data.signal.candidate);
      }
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('signal', handleSignal);

    socket.emit('join', { meeting_id: meetingId, user: user.email });

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('signal', handleSignal);
      connectionsRef.current.forEach(connection => connection.close());
      connectionsRef.current.clear();
    };
  }, [meetingId, user]);

  return { remoteStreams };
}