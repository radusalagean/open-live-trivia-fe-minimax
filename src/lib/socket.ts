import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://openlivetrivia.com';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  path: '/api/socket.io',
  withCredentials: true,
});

let authenticated = false;

export const connectSocket = (idToken: string) => {
  if (!socket.connected) {
    socket.connect();
  }
  
  if (!authenticated) {
    socket.emit('authentication', { idToken });
  }
};

export const disconnectSocket = () => {
  authenticated = false;
  socket.disconnect();
};

export const isAuthenticated = () => authenticated;

export const setAuthenticated = (value: boolean) => {
  authenticated = value;
};
