import { io, Socket } from 'socket.io-client';
import { config } from './config';

const SOCKET_URL = config.apiUrl.replace('/api', '');

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
