// export class WebRTCConnection {
//   private peerConnection: RTCPeerConnection;
//   private dataChannel: RTCDataChannel | null = null;

//   constructor(
//     private localStream: MediaStream,
//     private onTrack: (stream: MediaStream) => void
//   ) {
//     this.peerConnection = new RTCPeerConnection({
//       iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' }
//       ]
//     });

//     this.setupPeerConnection();
//   }

//   private setupPeerConnection() {
//     this.localStream.getTracks().forEach(track => {
//       this.peerConnection.addTrack(track, this.localStream);
//     });

//     this.peerConnection.ontrack = (event) => {
//       this.onTrack(event.streams[0]);
//     };
//   }

//   async createOffer() {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     return offer;
//   }

//   async handleAnswer(answer: RTCSessionDescriptionInit) {
//     await this.peerConnection.setRemoteDescription(answer);
//   }

//   async handleOffer(offer: RTCSessionDescriptionInit) {
//     await this.peerConnection.setRemoteDescription(offer);
//     const answer = await this.peerConnection.createAnswer();
//     await this.peerConnection.setLocalDescription(answer);
//     return answer;
//   }

//   async addIceCandidate(candidate: RTCIceCandidateInit) {
//     await this.peerConnection.addIceCandidate(candidate);
//   }

//   onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
//     this.peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         callback(event.candidate);
//       }
//     };
//   }

//   close() {
//     this.peerConnection.close();
//   }
// } 

//src/hooks/useWebRTC.ts
export class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream;
  private onRemoteStream: (stream: MediaStream) => void;

  constructor(localStream: MediaStream, onRemoteStream: (stream: MediaStream) => void) {
    this.peerConnection = new RTCPeerConnection();
    this.localStream = localStream;
    this.onRemoteStream = onRemoteStream;

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        this.onRemoteStream(event.streams[0]);
      }
    };
  }

  // Example: Create an offer
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Example: Handle remote answer
  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  // Example: Add ICE candidate
  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  closeConnection() {
    this.peerConnection.close();
  }
}

// Optional hook for managing WebRTC connections
export function useWebRTC() {
  // Example hook functionality, could be extended for reusable state management
  return {};
}
