import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    const url = process.env.REACT_APP_SOCKET_URL || window.location.origin;
    socket = io(url, { withCredentials: true });
  }
  return socket;
}

export default getSocket;
