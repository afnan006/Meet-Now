import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuthStore } from '../lib/store';
import { socket } from '../lib/socket';
import { useWebRTC } from '../hooks/useWebRTC';
import { validateMeeting } from '../lib/api';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageSquare, 
  Users, 
  X,
  Send
} from 'lucide-react';
import { useMeetingStore } from '../lib/store'; // added for meeting store

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export function Meeting() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { participants, setMeetingId } = useMeetingStore((state) => ({
    participants: state.participants,
    setMeetingId: state.setMeetingId,
  }));
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { remoteStreams } = useWebRTC(id);
  const [timer, setTimer] = useState(0);
  const [meetingValid, setMeetingValid] = useState<boolean>(false);

  useEffect(() => {
    const checkMeeting = async () => {
      try {
        const response = await validateMeeting(id);
        if (response.status === 'error') {
          navigate('/dashboard');
        } else {
          setMeetingValid(true);
          setMeetingId(id); // Set the meeting ID in the store
        }
      } catch (error) {
        console.error('Error validating meeting:', error);
        navigate('/dashboard');
      }
    };

    checkMeeting();
  }, [id, navigate, setMeetingId]);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (data: { sender: string; text: string; timestamp: string }) => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: data.sender,
        text: data.text,
        timestamp: new Date(data.timestamp)
      }]);
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      socket.emit('message', {
        meeting_id: id,
        sender: user.email,
        text: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const leaveMeeting = () => {
    if (user) {
      socket.emit('leave', { meeting_id: id, user: user.email });
    }
    localStream?.getTracks().forEach(track => track.stop());
    navigate('/dashboard');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1); // Increment timer every second
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  if (!meetingValid) {
    return <div>Loading...</div>; // Show loading while the meeting validation is happening
  }

  return (
    <div className="h-screen bg-stone-50 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-stone-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>Time Elapsed: {Math.floor(timer / 60)}:{timer % 60}</div>
            <Video className="h-6 w-6 text-rose-500" />
            <h1 className="font-semibold text-stone-900">Meeting: {id.slice(0, 8)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowChat(!showChat)}>
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={leaveMeeting}>
              Leave
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(participants.length, 5)} gap-4`}>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Button variant={audioEnabled ? 'primary' : 'secondary'} onClick={toggleAudio}>
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button variant={videoEnabled ? 'primary' : 'secondary'} onClick={toggleVideo}>
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {remoteStreams.map((stream, index) => (
              <div key={index} className="relative bg-black rounded-lg overflow-hidden">
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  srcObject={stream}
                />
              </div>
            ))}
          </div>
        </main>
      </div>

      {showChat && (
        <div className="w-full sm:w-80 bg-white border-t sm:border-l border-stone-200 flex flex-col">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Chat</h2>
            <Button variant="outline" onClick={() => setShowChat(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg ${
                  message.sender === user?.email
                    ? 'bg-rose-500 text-white ml-8'
                    : 'bg-stone-100 mr-8'
                }`}
              >
                <p className="text-sm font-medium">{message.sender}</p>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-stone-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
