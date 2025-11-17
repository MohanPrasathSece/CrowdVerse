import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    const url =
      process.env.REACT_APP_SOCKET_URL ||
      (typeof window !== 'undefined' && window.location && window.location.port === '3000'
        ? `${window.location.protocol}//${window.location.hostname}:5000`
        : window.location.origin);
    socket = io(url, { withCredentials: true });
  }
  return socket;
}

export default getSocket;
