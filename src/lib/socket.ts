// import { io } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:5000';

// export const socket = io(SOCKET_URL, {
//   autoConnect: false,
//   transports: ['websocket']
// });
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('cameraStateChange', (data) => {
  console.log('Camera state updated:', data);
});

socket.on('micStateChange', (data) => {
  console.log('Microphone state updated:', data);
});
