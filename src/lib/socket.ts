import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://openlivetrivia.com';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  path: '/api/socket.io',
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem('token');
    cb({ idToken: token });
  },
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
