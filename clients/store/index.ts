import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';
import notifycationReducer from './notifycationSlice'
import { socketReducer } from './socketSlice';
import { io, Socket } from 'socket.io-client';
import { socketMiddleware } from '@/middleware/socketMiddleware';

// Khởi tạo socket connection
const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

export const store = configureStore({
  reducer: {
    order: orderReducer,
    notifycation: notifycationReducer,
    socket: socketReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(socket)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 