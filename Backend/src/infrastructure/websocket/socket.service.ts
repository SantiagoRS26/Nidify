import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('household:join', (householdId: string) => {
      socket.join(`household:${householdId}`);
    });
  });
};

const getIo = (): Server => {
  if (!io) {
    throw new Error('Socket.io no inicializado');
  }
  return io;
};

export const notifyHousehold = (
  householdId: string,
  event: string,
  payload: unknown,
): void => {
  getIo().to(`household:${householdId}`).emit(event, payload);
};
