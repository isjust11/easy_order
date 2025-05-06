// clients/components/OrderComponent.tsx
import { useEffect } from 'react';
import { RootState } from '@/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SOCKET_CONNECT, SOCKET_DISCONNECT, socketEmit } from './actions/socketAction';
import SocketStatus from '@/components/SocketStatus';

const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

const SocketManager = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state: RootState) => state.socket);

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let reconnectAttempts = 0;

    const connect = () => {
      dispatch({ type: SOCKET_CONNECT });
    };

    const handleReconnect = () => {
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        dispatch({
          type: 'socket/reconnecting',
          payload: { reconnectAttempts }
        });
        reconnectTimer = setTimeout(connect, RECONNECT_INTERVAL);
      } else {
        dispatch({
          type: 'socket/error',
          payload: { error: 'Không thể kết nối đến server sau nhiều lần thử' }
        });
      }
    };

    connect();

    return () => {
      dispatch({ type: SOCKET_DISCONNECT });
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [dispatch]);

  const sendMessage = (message: any) => {
    dispatch({
      type: 'socket/sendMessage',
      payload: message
    });
  };

  return (
    <div>
      <p>Trạng thái kết nối: {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}</p>
      <button onClick={() => sendMessage('Hello')}>
        Gửi tin nhắn
      </button>
    </div>
  );
};

export default SocketManager;